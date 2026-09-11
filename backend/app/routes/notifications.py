from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


notifications_bp = Blueprint("notifications", __name__)


def serialize_notification(item):
    if item is None:
        return None
    item = item.copy()
    item.pop("_id", None)
    return item


@notifications_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    db = get_db()
    active_only = request.args.get("active") == "1"
    query = {"active": True} if active_only else {}
    items = list(db.notifications.find(query).sort("_id", DESCENDING))
    return jsonify([serialize_notification(item) for item in items])


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["GET"])
def get_notification(notification_id):
    db = get_db()
    item = db.notifications.find_one({"id": notification_id})
    if not item:
        return jsonify({"error": "Notification not found"}), 404
    return jsonify(serialize_notification(item))


@notifications_bp.route("/api/notifications", methods=["POST"])
@role_required("manage_notifications")
def create_notification():
    db = get_db()
    data = request.get_json() or {}

    if not data.get("title") or not data.get("message"):
        return jsonify({"error": "Title and message are required"}), 400

    last = db.notifications.find_one({}, sort=[("id", DESCENDING)])
    next_id = last["id"] + 1 if last else 1

    item = {
        "id": next_id,
        "title": data.get("title", ""),
        "message": data.get("message", ""),
        "link": data.get("link", ""),
        "image": data.get("image", ""),
        "active": bool(data.get("active", True)),
        "priority": data.get("priority", "normal"),
    }

    db.notifications.insert_one(item)
    return jsonify({
        "message": "Announcement created successfully",
        "notification": serialize_notification(item),
    }), 201


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["PUT"])
@role_required("manage_notifications")
def update_notification(notification_id):
    db = get_db()
    data = request.get_json() or {}

    allowed_fields = ["title", "message", "link", "image", "active", "priority"]
    update_data = {field: data[field] for field in allowed_fields if field in data}

    if not update_data:
        return jsonify({"error": "No valid fields provided for update"}), 400

    result = db.notifications.update_one({"id": notification_id}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"error": "Notification not found"}), 404

    item = db.notifications.find_one({"id": notification_id})
    return jsonify({
        "message": "Announcement updated successfully",
        "notification": serialize_notification(item),
    })


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["DELETE"])
@role_required("manage_notifications")
def delete_notification(notification_id):
    db = get_db()
    result = db.notifications.delete_one({"id": notification_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Notification not found"}), 404
    return jsonify({"message": "Announcement deleted successfully"})
