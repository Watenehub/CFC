from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required

sermons_bp = Blueprint("sermons", __name__)

sermons = []


@sermons_bp.route("/api/sermons", methods=["GET"])
def get_sermons():
    return jsonify(sermons)


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["GET"])
def get_sermon(sermon_id):
    sermon = next(
        (item for item in sermons if item["id"] == sermon_id),
        None
    )

    if not sermon:
        return jsonify({"error": "Sermon not found"}), 404

    return jsonify(sermon)


@sermons_bp.route("/api/sermons", methods=["POST"])
@role_required("manage_sermons")
def create_sermon():
    data = request.get_json() or {}

    sermon = {
        "id": len(sermons) + 1,
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

    sermons.append(sermon)

    return jsonify({
        "message": "Sermon created successfully",
        "sermon": sermon
    }), 201


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["PUT"])
@role_required("manage_sermons")
def update_sermon(sermon_id):
    sermon = next(
        (item for item in sermons if item["id"] == sermon_id),
        None
    )

    if not sermon:
        return jsonify({"error": "Sermon not found"}), 404

    data = request.get_json() or {}

    for field in [
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
    ]:
        if field in data:
            sermon[field] = data[field]

    return jsonify({
        "message": "Sermon updated successfully",
        "sermon": sermon
    })


@sermons_bp.route("/api/sermons/<int:sermon_id>", methods=["DELETE"])
@role_required("manage_sermons")
def delete_sermon(sermon_id):
    sermon = next(
        (item for item in sermons if item["id"] == sermon_id),
        None
    )

    if not sermon:
        return jsonify({"error": "Sermon not found"}), 404

    sermons.remove(sermon)

    return jsonify({
        "message": "Sermon deleted successfully"
    })