from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import ASCENDING, DESCENDING


services_bp = Blueprint("services", __name__)


def serialize_service(item):
    if item is None:
        return None
    item = item.copy()
    item.pop("_id", None)
    return item


@services_bp.route("/api/services", methods=["GET"])
def get_services():
    db = get_db()
    items = list(db.services.find().sort([("day_order", ASCENDING), ("id", ASCENDING)]))
    return jsonify([serialize_service(item) for item in items])


@services_bp.route("/api/services/<int:service_id>", methods=["GET"])
def get_service(service_id):
    db = get_db()
    item = db.services.find_one({"id": service_id})
    if not item:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(serialize_service(item))


@services_bp.route("/api/services", methods=["POST"])
@role_required("manage_services")
def create_service():
    db = get_db()
    data = request.get_json() or {}

    if not data.get("name"):
        return jsonify({"error": "Service name is required"}), 400

    last = db.services.find_one({}, sort=[("id", DESCENDING)])
    next_id = last["id"] + 1 if last else 1

    day = data.get("day", "Sunday")
    day_order_map = {
        "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
        "Thursday": 4, "Friday": 5, "Saturday": 6,
    }

    item = {
        "id": next_id,
        "name": data.get("name", ""),
        "day": day,
        "day_order": day_order_map.get(day, 0),
        "time": data.get("time", ""),
        "location": data.get("location", ""),
        "description": data.get("description", ""),
    }

    db.services.insert_one(item)
    return jsonify({
        "message": "Service created successfully",
        "service": serialize_service(item),
    }), 201


@services_bp.route("/api/services/<int:service_id>", methods=["PUT"])
@role_required("manage_services")
def update_service(service_id):
    db = get_db()
    data = request.get_json() or {}

    allowed_fields = ["name", "day", "time", "location", "description"]
    update_data = {field: data[field] for field in allowed_fields if field in data}

    if "day" in update_data:
        day_order_map = {
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
            "Thursday": 4, "Friday": 5, "Saturday": 6,
        }
        update_data["day_order"] = day_order_map.get(update_data["day"], 0)

    if not update_data:
        return jsonify({"error": "No valid fields provided for update"}), 400

    result = db.services.update_one({"id": service_id}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"error": "Service not found"}), 404

    item = db.services.find_one({"id": service_id})
    return jsonify({
        "message": "Service updated successfully",
        "service": serialize_service(item),
    })


@services_bp.route("/api/services/<int:service_id>", methods=["DELETE"])
@role_required("manage_services")
def delete_service(service_id):
    db = get_db()
    result = db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"message": "Service deleted successfully"})
