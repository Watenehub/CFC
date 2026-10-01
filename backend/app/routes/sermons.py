from flask import Blueprint, jsonify, request
from ..auth.permissions import get_session_user, role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING
from ..security import pagination_args, safe_web_url


sermons_bp = Blueprint("sermons", __name__)


def serialize_sermon(sermon):
    if sermon is None:
        return None
    fields = ("id", "title", "description", "speaker", "date", "video_url", "audio_url", "thumbnail", "scripture", "category", "tags", "key_takeaways")
    public = {field: sermon[field] for field in fields if field in sermon}
    for field in ("video_url", "audio_url", "thumbnail"):
        if field in public:
            public[field] = safe_web_url(public[field])
    return public


@sermons_bp.route("/api/sermons", methods=["GET"])
def get_sermons():
    """Get all sermons."""
    db = get_db()

    query = {"status": {"$ne": "draft"}}
    if request.args.get("include_drafts") == "1":
        user = get_session_user()
        if not user or user.get("role") != "admin":
            return jsonify({"error": "Access denied"}), 403
        query = {}
    page, page_size = pagination_args(request.args)
    cursor = db.sermons.find(query).sort("_id", DESCENDING).skip((page - 1) * page_size).limit(page_size)
    sermons = list(cursor)

    return jsonify([
        serialize_sermon(sermon)
        for sermon in sermons
    ])


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["GET"])
def get_sermon(sermon_id):
    """Get a single sermon by ID."""
    db = get_db()

    sermon = db.sermons.find_one({"id": sermon_id, "status": {"$ne": "draft"}})

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
        "tags": data.get("tags", []),
        "key_takeaways": data.get("key_takeaways", ""),
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
        "tags",
        "key_takeaways",
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