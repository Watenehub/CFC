from flask import Blueprint, jsonify

notifications_bp = Blueprint("notifications", __name__)

notifications = []


@notifications_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    return jsonify(notifications)


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["GET"])
def get_notification(notification_id):
    notification = next(
        (item for item in notifications if item["id"] == notification_id),
        None
    )

    if not notification:
        return jsonify({"error": "Notification not found"}), 404

    return jsonify(notification)


@notifications_bp.route("/api/notifications", methods=["POST"])
def create_notification():
    return jsonify({
        "message": "Notification creation endpoint is ready"
    }), 201


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["PUT"])
def update_notification(notification_id):
    return jsonify({
        "message": f"Notification {notification_id} update endpoint is ready"
    })


@notifications_bp.route("/api/notifications/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    return jsonify({
        "message": f"Notification {notification_id} delete endpoint is ready"
    })