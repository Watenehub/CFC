from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


giving_bp = Blueprint("giving", __name__)


def serialize_giving(giving):
    """Convert MongoDB document into a JSON-safe API response."""
    if giving is None:
        return None

    giving = giving.copy()
    giving.pop("_id", None)

    return giving


@giving_bp.route("/api/giving", methods=["GET"])
def get_giving():
    """Get all giving options."""
    db = get_db()

    giving = list(
        db.giving.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_giving(item)
        for item in giving
    ])


@giving_bp.route("/api/giving/<int:giving_id>", methods=["GET"])
def get_giving_option(giving_id):
    """Get a single giving option by ID."""
    db = get_db()

    giving = db.giving.find_one({
        "id": giving_id
    })

    if not giving:
        return jsonify({"error": "Giving option not found"}), 404

    return jsonify(
        serialize_giving(giving)
    )


@giving_bp.route("/api/giving", methods=["POST"])
@role_required("manage_giving")
def create_giving():
    """Create a new giving option."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_giving = db.giving.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_giving["id"] + 1
        if last_giving
        else 1
    )

    giving = {
        "id": next_id,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "category": data.get("category", ""),
        "payment_method": data.get("payment_method", ""),
        "payment_details": data.get("payment_details", ""),
        "poster": data.get("poster", ""),
        "mpesa_business_no": data.get("mpesa_business_no", ""),
        "mpesa_account_no": data.get("mpesa_account_no", ""),
        "bank_name": data.get("bank_name", ""),
        "bank_account_name": data.get("bank_account_name", ""),
        "bank_account_no": data.get("bank_account_no", ""),
        "cheque_payee": data.get("cheque_payee", ""),
    }

    db.giving.insert_one(giving)

    return jsonify({
        "message": "Giving option created successfully",
        "giving": serialize_giving(giving)
    }), 201


@giving_bp.route("/api/giving/<int:giving_id>", methods=["PUT"])
@role_required("manage_giving")
def update_giving(giving_id):
    """Update an existing giving option."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "title",
        "description",
        "category",
        "payment_method",
        "payment_details",
        "poster",
        "mpesa_business_no",
        "mpesa_account_no",
        "bank_name",
        "bank_account_name",
        "bank_account_no",
        "cheque_payee",
    ]

    update_data = {
        field: data[field]
        for field in allowed_fields
        if field in data
    }

    if not update_data:
        return jsonify({
            "error": "No valid fields provided for update"
        }), 400

    result = db.giving.update_one(
        {
            "id": giving_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Giving option not found"}), 404

    giving = db.giving.find_one({
        "id": giving_id
    })

    return jsonify({
        "message": "Giving option updated successfully",
        "giving": serialize_giving(giving)
    })


@giving_bp.route("/api/giving/<int:giving_id>", methods=["DELETE"])
@role_required("manage_giving")
def delete_giving(giving_id):
    """Delete a giving option."""
    db = get_db()

    result = db.giving.delete_one({
        "id": giving_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Giving option not found"}), 404

    return jsonify({
        "message": "Giving option deleted successfully"
    })