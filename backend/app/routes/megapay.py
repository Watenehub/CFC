import logging
import os
from datetime import datetime, timezone

import requests
from flask import Blueprint, jsonify, request

from ..auth.permissions import role_required
from ..database.mongodb import get_db
from ..security import limiter
from .mpesa import validate_amount, validate_phone_number

logger = logging.getLogger(__name__)

megapay_bp = Blueprint("megapay", __name__)

MEGAPAY_STK_URL = "https://megapay.co.ke/backend/v1/initiatestk"
MEGAPAY_STATUS_URL = "https://megapay.co.ke/backend/v1/transactionstatus"
HEADERS = {"Content-Type": "application/json"}


def _credentials():
    api_key = os.getenv("MEGAPAY_API_KEY")
    email = os.getenv("MEGAPAY_EMAIL")
    if not api_key or not email:
        return None, None
    return api_key, email


def _now():
    return datetime.now(timezone.utc)


def _classify(result):
    """Map a MegaPay status payload to pending/success/failed/cancelled."""
    if not isinstance(result, dict):
        return "pending"
    parts = []
    for key, value in result.items():
        if isinstance(value, (str, int)) and key.lower() in {
            "status", "transaction_status", "resultdesc", "result_desc", "message",
            "resultcode", "result_code", "description", "transactionstatus",
        }:
            parts.append(str(value).lower())
    text = " ".join(parts)
    if "cancel" in text or "1032" in text:
        return "cancelled"
    if any(word in text for word in ("fail", "insufficient", "timeout", "timed out", "reject", "declin", "expired", "invalid")):
        return "failed"
    if any(word in text for word in ("success", "complete", "paid", "confirmed")) or text.strip() in {"0", "00"}:
        return "success"
    return "pending"


def _find_receipt(value):
    """Search a provider payload (any nesting) for an M-PESA receipt code."""
    keys = ("receipt", "mpesa_code", "mpesa_ref", "transaction_code", "confirmation_code")
    if isinstance(value, dict):
        for key, item in value.items():
            if isinstance(item, (str, int)) and item and any(k in key.lower().replace(" ", "_") for k in keys):
                return str(item)
        for item in value.values():
            found = _find_receipt(item)
            if found:
                return found
    elif isinstance(value, list):
        for item in value:
            found = _find_receipt(item)
            if found:
                return found
    return None


def _serialize(doc):
    return {
        "id": str(doc["_id"]),
        "transaction_request_id": doc.get("transaction_request_id"),
        "phone": doc.get("phone"),
        "amount": doc.get("amount"),
        "reference": doc.get("reference"),
        "status": doc.get("status", "pending"),
        "receipt": doc.get("receipt"),
        "created_at": doc["created_at"].isoformat() + "Z" if doc.get("created_at") else None,
        "updated_at": doc["updated_at"].isoformat() + "Z" if doc.get("updated_at") else None,
    }


@megapay_bp.route("/api/megapay/stkpush", methods=["POST"])
@limiter.limit("5 per minute")
def megapay_stk_push():
    api_key, email = _credentials()
    if not api_key:
        return jsonify({"error": "Digital payments are not configured"}), 503

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body is required"}), 400

    amount, error = validate_amount(data.get("amount"))
    if error:
        return jsonify({"error": error}), 400

    phone, error = validate_phone_number(data.get("phone"))
    if error:
        return jsonify({"error": error}), 400

    try:
        giving_id = int(data.get("giving_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "Please choose what you are giving towards"}), 400
    giving = get_db().giving.find_one({"id": giving_id})
    if not giving:
        return jsonify({"error": "Giving option not found"}), 404

    reference = str(giving.get("title") or "Church giving").strip()[:60]
    payload = {
        "api_key": api_key,
        "email": email,
        "amount": str(int(round(amount))),
        "msisdn": "0" + phone[3:],
        "reference": reference,
    }

    record = {
        "transaction_request_id": None,
        "phone": "0" + phone[3:],
        "amount": amount,
        "reference": reference,
        "status": "pending",
        "created_at": _now(),
        "updated_at": _now(),
    }
    db = get_db()
    inserted = db.megapay_transactions.insert_one(record)

    def mark(status, **extra):
        db.megapay_transactions.update_one(
            {"_id": inserted.inserted_id},
            {"$set": {"status": status, "updated_at": _now(), **extra}},
        )

    try:
        response = requests.post(MEGAPAY_STK_URL, json=payload, headers=HEADERS, timeout=30)
        result = response.json()
    except (requests.RequestException, ValueError) as exc:
        logger.warning("MegaPay STK request failed (%s)", type(exc).__name__)
        mark("failed", failure_reason="Payment provider unavailable")
        return jsonify({"error": "Payment provider unavailable"}), 502

    request_id = result.get("transaction_request_id") if isinstance(result, dict) else None
    if not response.ok or not request_id:
        mark("failed", failure_reason="Payment request rejected")
        return jsonify({"error": "Payment request rejected"}), 502

    mark("pending", transaction_request_id=str(request_id))
    return jsonify({
        "message": "Check your phone and enter your M-PESA PIN to complete the payment.",
        "transaction_request_id": request_id,
    }), 200


def _refresh(db, doc, api_key, email):
    """Query MegaPay for a pending transaction and persist the outcome."""
    try:
        response = requests.post(
            MEGAPAY_STATUS_URL,
            json={"api_key": api_key, "email": email, "transaction_request_id": doc["transaction_request_id"]},
            headers=HEADERS,
            timeout=20,
        )
        result = response.json()
    except (requests.RequestException, ValueError):
        return doc

    status = _classify(result)
    updates = {"updated_at": _now(), "provider_response": result}
    if status != "pending":
        updates["status"] = status
    receipt = _find_receipt(result)
    if receipt:
        updates["receipt"] = receipt
    db.megapay_transactions.update_one({"_id": doc["_id"]}, {"$set": updates})
    doc.update(updates)
    return doc


@megapay_bp.route("/api/megapay/status", methods=["POST"])
@limiter.limit("30 per minute")
def megapay_status():
    api_key, email = _credentials()
    if not api_key:
        return jsonify({"error": "Digital payments are not configured"}), 503

    data = request.get_json(silent=True)
    request_id = data.get("transaction_request_id") if isinstance(data, dict) else None
    if not request_id:
        return jsonify({"error": "transaction_request_id is required"}), 400

    db = get_db()
    doc = db.megapay_transactions.find_one({"transaction_request_id": str(request_id)})
    if not doc:
        return jsonify({"error": "Transaction not found"}), 404
    if doc.get("status") == "pending" or (doc.get("status") == "success" and not doc.get("receipt")):
        doc = _refresh(db, doc, api_key, email)
    return jsonify({"status": doc.get("status")}), 200


@megapay_bp.route("/api/megapay/transactions", methods=["GET"])
@role_required("manage_transactions")
def megapay_transactions():
    db = get_db()
    api_key, email = _credentials()
    status = request.args.get("status")
    query = {"status": status} if status in {"pending", "success", "failed", "cancelled"} else {}
    docs = list(db.megapay_transactions.find(query).sort("created_at", -1).limit(500))

    if api_key and request.args.get("refresh") == "1":
        for doc in docs[:25]:
            needs_refresh = doc.get("status") == "pending" or (doc.get("status") == "success" and not doc.get("receipt"))
            if needs_refresh and doc.get("transaction_request_id"):
                _refresh(db, doc, api_key, email)

    return jsonify([_serialize(doc) for doc in docs])