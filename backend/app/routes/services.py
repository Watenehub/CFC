from flask import Blueprint, jsonify

services_bp = Blueprint("services", __name__)

services = []


@services_bp.route("/api/services", methods=["GET"])
def get_services():
    return jsonify(services)


@services_bp.route("/api/services/<int:service_id>", methods=["GET"])
def get_service(service_id):
    service = next(
        (item for item in services if item["id"] == service_id),
        None
    )

    if not service:
        return jsonify({"error": "Service not found"}), 404

    return jsonify(service)


@services_bp.route("/api/services", methods=["POST"])
def create_service():
    return jsonify({
        "message": "Service creation endpoint is ready"
    }), 201


@services_bp.route("/api/services/<int:service_id>", methods=["PUT"])
def update_service(service_id):
    return jsonify({
        "message": f"Service {service_id} update endpoint is ready"
    })


@services_bp.route("/api/services/<int:service_id>", methods=["DELETE"])
def delete_service(service_id):
    return jsonify({
        "message": f"Service {service_id} delete endpoint is ready"
    })