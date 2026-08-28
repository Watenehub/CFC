from flask import Blueprint, jsonify

pastors_bp = Blueprint("pastors", __name__)

pastors = []


@pastors_bp.route("/api/pastors", methods=["GET"])
def get_pastors():
    return jsonify(pastors)


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["GET"])
def get_pastor(pastor_id):
    pastor = next(
        (item for item in pastors if item["id"] == pastor_id),
        None
    )

    if not pastor:
        return jsonify({"error": "Pastor not found"}), 404

    return jsonify(pastor)


@pastors_bp.route("/api/pastors", methods=["POST"])
def create_pastor():
    return jsonify({
        "message": "Pastor creation endpoint is ready"
    }), 201


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["PUT"])
def update_pastor(pastor_id):
    return jsonify({
        "message": f"Pastor {pastor_id} update endpoint is ready"
    })


@pastors_bp.route("/api/pastors/<int:pastor_id>", methods=["DELETE"])
def delete_pastor(pastor_id):
    return jsonify({
        "message": f"Pastor {pastor_id} delete endpoint is ready"
    })