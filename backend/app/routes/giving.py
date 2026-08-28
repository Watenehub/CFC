from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required

giving_bp = Blueprint("giving", __name__)

giving_options = []


@giving_bp.route("/api/giving", methods=["GET"])
def get_giving():
    return jsonify(giving_options)


@giving_bp.route("/api/giving/<int:giving_id>", methods=["GET"])
def get_giving_option(giving_id):
    giving = next(
        (item for item in giving_options if item["id"] == giving_id),
        None
    )

    if not giving:
        return jsonify({"error": "Giving option not found"}), 404

    return jsonify(giving)


@giving_bp.route("/api/giving", methods=["POST"])
@role_required("manage_giving")
def create_giving():
    data = request.get_json() or {}

    giving = {
        "id": len(giving_options) + 1,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "category": data.get("category", ""),
        "payment_method": data.get("payment_method", ""),
        "payment_details": data.get("payment_details", ""),
        "poster": data.get("poster", "")
    }

    giving_options.append(giving)

    return jsonify({
        "message": "Giving option created successfully",
        "giving": giving
    }), 201


@giving_bp.route("/api/giving/<int:giving_id>", methods=["PUT"])
@role_required("manage_giving")
def update_giving(giving_id):
    giving = next(
        (item for item in giving_options if item["id"] == giving_id),
        None
    )

    if not giving:
        return jsonify({"error": "Giving option not found"}), 404

    data = request.get_json() or {}

    for field in [
        "title",
        "description",
        "category",
        "payment_method",
        "payment_details",
        "poster"
    ]:
        if field in data:
            giving[field] = data[field]

    return jsonify({
        "message": "Giving option updated successfully",
        "giving": giving
    })


@giving_bp.route("/api/giving/<int:giving_id>", methods=["DELETE"])
@role_required("manage_giving")
def delete_giving(giving_id):
    giving = next(
        (item for item in giving_options if item["id"] == giving_id),
        None
    )

    if not giving:
        return jsonify({"error": "Giving option not found"}), 404

    giving_options.remove(giving)

    return jsonify({
        "message": "Giving option deleted successfully"
    })