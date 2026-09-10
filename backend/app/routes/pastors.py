from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


pastors_bp = Blueprint("pastors", __name__)


def serialize_pastor(pastor):
    """Convert MongoDB document into a JSON-safe API response."""
    if pastor is None:
        return None

    pastor = pastor.copy()
    pastor.pop("_id", None)

    return pastor


@pastors_bp.route("/api/pastors", methods=["GET"])
def get_pastors():
    """Get all pastors."""
    db = get_db()

    pastors = list(
        db.pastors.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_pastor(pastor)
        for pastor in pastors
    ])


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["GET"])
def get_pastor(pastor_id):
    """Get a single pastor by ID."""
    db = get_db()

    pastor = db.pastors.find_one({
        "id": pastor_id
    })

    if not pastor:
        return jsonify({"error": "Pastor not found"}), 404

    return jsonify(
        serialize_pastor(pastor)
    )


@pastors_bp.route("/api/pastors", methods=["POST"])
@role_required("manage_pastors")
def create_pastor():
    """Create a new pastor."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_pastor = db.pastors.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_pastor["id"] + 1
        if last_pastor
        else 1
    )

    pastor = {
        "id": next_id,
        "name": data.get("name", ""),
        "title": data.get("title", ""),
        "bio": data.get("bio", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "image": data.get("image", ""),
        "encouragement": data.get("encouragement", ""),
    }

    db.pastors.insert_one(pastor)

    return jsonify({
        "message": "Pastor created successfully",
        "pastor": serialize_pastor(pastor)
    }), 201


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["PUT"])
@role_required("manage_pastors")
def update_pastor(pastor_id):
    """Update an existing pastor."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "name",
        "title",
        "bio",
        "email",
        "phone",
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

    result = db.pastors.update_one(
        {
            "id": pastor_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Pastor not found"}), 404

    pastor = db.pastors.find_one({
        "id": pastor_id
    })

    return jsonify({
        "message": "Pastor updated successfully",
        "pastor": serialize_pastor(pastor)
    })


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["DELETE"])
@role_required("manage_pastors")
def delete_pastor(pastor_id):
    """Delete a pastor."""
    db = get_db()

    result = db.pastors.delete_one({
        "id": pastor_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Pastor not found"}), 404

    return jsonify({
        "message": "Pastor deleted successfully"
    })