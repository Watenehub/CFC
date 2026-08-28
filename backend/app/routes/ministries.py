from flask import Blueprint, jsonify

ministries_bp = Blueprint("ministries", __name__)

ministries = []


@ministries_bp.route("/api/ministries", methods=["GET"])
def get_ministries():
    return jsonify(ministries)


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["GET"])
def get_ministry(ministry_id):
    ministry = next(
        (item for item in ministries if item["id"] == ministry_id),
        None
    )

    if not ministry:
        return jsonify({"error": "Ministry not found"}), 404

    return jsonify(ministry)


@ministries_bp.route("/api/ministries", methods=["POST"])
def create_ministry():
    return jsonify({
        "message": "Ministry creation endpoint is ready"
    }), 201


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["PUT"])
def update_ministry(ministry_id):
    return jsonify({
        "message": f"Ministry {ministry_id} update endpoint is ready"
    })


@ministries_bp.route("/api/ministries/<int:ministry_id>", methods=["DELETE"])
def delete_ministry(ministry_id):
    return jsonify({
        "message": f"Ministry {ministry_id} delete endpoint is ready"
    })