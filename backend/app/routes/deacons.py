from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


deacons_bp = Blueprint("deacons", __name__)


def serialize_deacon(deacon):
    """Convert MongoDB document into a JSON-safe API response."""
    if deacon is None:
        return None

    deacon = deacon.copy()
    deacon.pop("_id", None)

    return deacon


@deacons_bp.route("/api/deacons", methods=["GET"])
def get_deacons():
    """Get all deacons."""
    db = get_db()

    deacons = list(
        db.deacons.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_deacon(deacon)
        for deacon in deacons
    ])


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["GET"])
def get_deacon(deacon_id):
    """Get a single deacon by ID."""
    db = get_db()

    deacon = db.deacons.find_one({
        "id": deacon_id
    })

    if not deacon:
        return jsonify({"error": "Deacon not found"}), 404

    return jsonify(
        serialize_deacon(deacon)
    )


@deacons_bp.route("/api/deacons", methods=["POST"])
@role_required("manage_deacons")
def create_deacon():
    """Create a new deacon."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_deacon = db.deacons.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_deacon["id"] + 1
        if last_deacon
        else 1
    )

    deacon = {
        "id": next_id,
        "name": data.get("name", ""),
        "title": data.get("title", ""),
        "bio": data.get("bio", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "image": data.get("image", "")
    }

    db.deacons.insert_one(deacon)

    return jsonify({
        "message": "Deacon created successfully",
        "deacon": serialize_deacon(deacon)
    }), 201


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["PUT"])
@role_required("manage_deacons")
def update_deacon(deacon_id):
    """Update an existing deacon."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "name",
        "title",
        "bio",
        "email",
        "phone",
        "image"
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

    result = db.deacons.update_one(
        {
            "id": deacon_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Deacon not found"}), 404

    deacon = db.deacons.find_one({
        "id": deacon_id
    })

    return jsonify({
        "message": "Deacon updated successfully",
        "deacon": serialize_deacon(deacon)
    })


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["DELETE"])
@role_required("manage_deacons")
def delete_deacon(deacon_id):
    """Delete a deacon."""
    db = get_db()

    result = db.deacons.delete_one({
        "id": deacon_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Deacon not found"}), 404

    return jsonify({
        "message": "Deacon deleted successfully"
    })