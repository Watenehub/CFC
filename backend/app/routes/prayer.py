from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


prayer_bp = Blueprint("prayer", __name__)


def serialize_prayer(item):
    if item is None:
        return None
    item = item.copy()
    item.pop("_id", None)
    return item


@prayer_bp.route("/api/prayer", methods=["GET"])
@role_required("manage_enquiries")
def get_prayer_requests():
    db = get_db()
    items = list(db.prayer_requests.find().sort("_id", DESCENDING))
    return jsonify([serialize_prayer(item) for item in items])


@prayer_bp.route("/api/prayer/<int:prayer_id>", methods=["GET"])
@role_required("manage_enquiries")
def get_prayer_request(prayer_id):
    db = get_db()
    item = db.prayer_requests.find_one({"id": prayer_id})
    if not item:
        return jsonify({"error": "Prayer request not found"}), 404
    return jsonify(serialize_prayer(item))


@prayer_bp.route("/api/prayer", methods=["POST"])
def create_prayer_request():
    db = get_db()
    data = request.get_json() or {}

    request_text = data.get("prayerRequest") or data.get("request") or ""
    if not request_text.strip():
        return jsonify({"error": "Prayer request is required"}), 400

    last = db.prayer_requests.find_one({}, sort=[("id", DESCENDING)])
    next_id = last["id"] + 1 if last else 1

    item = {
        "id": next_id,
        "name": data.get("name", "") or "Anonymous",
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "request": request_text.strip(),
        "category": data.get("category", "general"),
        "privacy": data.get("privacy", "private"),
        "status": "New",
        "notes": "",
    }

    db.prayer_requests.insert_one(item)
    return jsonify({
        "message": "Prayer request submitted successfully",
        "prayer": serialize_prayer(item),
    }), 201


@prayer_bp.route("/api/prayer/<int:prayer_id>", methods=["PUT"])
@role_required("manage_enquiries")
def update_prayer_request(prayer_id):
    db = get_db()
    data = request.get_json() or {}

    allowed_fields = ["status", "notes"]
    update_data = {field: data[field] for field in allowed_fields if field in data}

    if not update_data:
        return jsonify({"error": "No valid fields provided for update"}), 400

    result = db.prayer_requests.update_one({"id": prayer_id}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"error": "Prayer request not found"}), 404

    item = db.prayer_requests.find_one({"id": prayer_id})
    return jsonify({
        "message": "Prayer request updated successfully",
        "prayer": serialize_prayer(item),
    })


@prayer_bp.route("/api/prayer/<int:prayer_id>", methods=["DELETE"])
@role_required("manage_enquiries")
def delete_prayer_request(prayer_id):
    db = get_db()
    result = db.prayer_requests.delete_one({"id": prayer_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Prayer request not found"}), 404
    return jsonify({"message": "Prayer request deleted successfully"})
