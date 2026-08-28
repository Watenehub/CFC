from flask import Blueprint, jsonify

deacons_bp = Blueprint("deacons", __name__)

deacons = []


@deacons_bp.route("/api/deacons", methods=["GET"])
def get_deacons():
    return jsonify(deacons)


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["GET"])
def get_deacon(deacon_id):
    deacon = next(
        (item for item in deacons if item["id"] == deacon_id),
        None
    )

    if not deacon:
        return jsonify({"error": "Deacon not found"}), 404

    return jsonify(deacon)


@deacons_bp.route("/api/deacons", methods=["POST"])
def create_deacon():
    return jsonify({
        "message": "Deacon creation endpoint is ready"
    }), 201


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["PUT"])
def update_deacon(deacon_id):
    return jsonify({
        "message": f"Deacon {deacon_id} update endpoint is ready"
    })


@deacons_bp.route("/api/deacons/<int:deacon_id>", methods=["DELETE"])
def delete_deacon(deacon_id):
    return jsonify({
        "message": f"Deacon {deacon_id} delete endpoint is ready"
    })