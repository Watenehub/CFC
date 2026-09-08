from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


sermons_bp = Blueprint("sermons", __name__)


def serialize_sermon(sermon):
    """Convert MongoDB document into a JSON-safe API response."""
    if sermon is None:
        return None

    sermon = sermon.copy()
    sermon.pop("_id", None)

    return sermon


@sermons_bp.route("/api/sermons", methods=["GET"])
def get_sermons():
    """Get all sermons."""
    db = get_db()

    sermons = list(
        db.sermons.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_sermon(sermon)
        for sermon in sermons
    ])


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["GET"])
def get_sermon(sermon_id):
    """Get a single sermon by ID."""
    db = get_db()

    sermon = db.sermons.find_one({
        "id": sermon_id
    })

    if not sermon:
        return jsonify({
            "error": "Sermon not found"
        }), 404

    return jsonify(
        serialize_sermon(sermon)
    )


@sermons_bp.route("/api/sermons", methods=["POST"])
@role_required("manage_sermons")
def create_sermon():
    """Create a new sermon."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_sermon = db.sermons.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_sermon["id"] + 1
        if last_sermon
        else 1
    )

    sermon = {
        "id": next_id,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "speaker": data.get("speaker", ""),
        "date": data.get("date", ""),
        "video_url": data.get("video_url", ""),
        "audio_url": data.get("audio_url", ""),
        "thumbnail": data.get("thumbnail", ""),
        "scripture": data.get("scripture", ""),
        "category": data.get("category", ""),
        "tags": data.get("tags", [])
    }

    db.sermons.insert_one(sermon)

    return jsonify({
        "message": "Sermon created successfully",
        "sermon": serialize_sermon(sermon)
    }), 201


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["PUT"])
@role_required("manage_sermons")
def update_sermon(sermon_id):
    """Update an existing sermon."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "title",
        "description",
        "speaker",
        "date",
        "video_url",
        "audio_url",
        "thumbnail",
        "scripture",
        "category",
        "tags"
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

    result = db.sermons.update_one(
        {
            "id": sermon_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({
            "error": "Sermon not found"
        }), 404

    sermon = db.sermons.find_one({
        "id": sermon_id
    })

    return jsonify({
        "message": "Sermon updated successfully",
        "sermon": serialize_sermon(sermon)
    })


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["DELETE"])
@role_required("manage_sermons")
def delete_sermon(sermon_id):
    """Delete a sermon."""
    db = get_db()

    result = db.sermons.delete_one({
        "id": sermon_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "error": "Sermon not found"
        }), 404

    return jsonify({
        "message": "Sermon deleted successfully"
    })