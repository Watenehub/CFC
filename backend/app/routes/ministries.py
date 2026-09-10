from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


ministries_bp = Blueprint("ministries", __name__)


def serialize_ministry(ministry):
    """Convert MongoDB document into a JSON-safe API response."""
    if ministry is None:
        return None

    ministry = ministry.copy()
    ministry.pop("_id", None)

    return ministry


@ministries_bp.route("/api/ministries", methods=["GET"])
def get_ministries():
    """Get all ministries."""
    db = get_db()

    ministries = list(
        db.ministries.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_ministry(ministry)
        for ministry in ministries
    ])


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["GET"])
def get_ministry(ministry_id):
    """Get a single ministry by ID."""
    db = get_db()

    ministry = db.ministries.find_one({
        "id": ministry_id
    })

    if not ministry:
        return jsonify({"error": "Ministry not found"}), 404

    return jsonify(
        serialize_ministry(ministry)
    )


@ministries_bp.route("/api/ministries", methods=["POST"])
@role_required("manage_ministries")
def create_ministry():
    """Create a new ministry."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_ministry = db.ministries.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_ministry["id"] + 1
        if last_ministry
        else 1
    )

    ministry = {
        "id": next_id,
        "name": data.get("name", ""),
        "description": data.get("description", ""),
        "leader": data.get("leader", ""),
        "meeting_time": data.get("meeting_time", ""),
        "location": data.get("location", ""),
        "contact": data.get("contact", ""),
        "image": data.get("image", ""),
        "encouragement": data.get("encouragement", ""),
    }

    db.ministries.insert_one(ministry)

    return jsonify({
        "message": "Ministry created successfully",
        "ministry": serialize_ministry(ministry)
    }), 201


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["PUT"])
@role_required("manage_ministries")
def update_ministry(ministry_id):
    """Update an existing ministry."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "name",
        "description",
        "leader",
        "meeting_time",
        "location",
        "contact",
        "image",
        "encouragement",
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

    result = db.ministries.update_one(
        {
            "id": ministry_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Ministry not found"}), 404

    ministry = db.ministries.find_one({
        "id": ministry_id
    })

    return jsonify({
        "message": "Ministry updated successfully",
        "ministry": serialize_ministry(ministry)
    })


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["DELETE"])
@role_required("manage_ministries")
def delete_ministry(ministry_id):
    """Delete a ministry."""
    db = get_db()

    result = db.ministries.delete_one({
        "id": ministry_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Ministry not found"}), 404

    return jsonify({
        "message": "Ministry deleted successfully"
    })