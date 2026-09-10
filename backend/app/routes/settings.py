from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db


settings_bp = Blueprint("settings", __name__)

DEFAULT_SETTINGS = {
    "church_name": "Cornerstone Family Chapel",
    "address": "Cornerstone Family Chapel, Nairobi, Kenya",
    "phone": "+254 700 000 000",
    "email": "hello@cornerstonechapel.org",
    "service_times": "Sunday Worship: 9:00 AM, Bible Study: Wednesday 6:30 PM",
    "livestream_url": "https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw",
    "map_url": "https://maps.google.com/?q=Cornerstone Family Chapel Nairobi",
    "office_hours": "Mon-Fri 8:00 AM - 5:00 PM",
    "is_live": False,
    "mission": "To know Christ and make Him known through worship, discipleship, fellowship, and service.",
    "vision": "A growing family of faith rooted in Scripture, united in love, and active in our community.",
    "beliefs": "We believe in one God — Father, Son, and Holy Spirit — and that salvation is found in Jesus Christ alone. Scripture is our authority for faith and life.",
}


def serialize_settings(settings):
    if settings is None:
        return DEFAULT_SETTINGS.copy()

    settings = settings.copy()
    settings.pop("_id", None)
    settings.pop("id", None)
    return {**DEFAULT_SETTINGS, **settings}


@settings_bp.route("/api/settings", methods=["GET"])
def get_settings():
    db = get_db()
    settings = db.settings.find_one({"id": "site"})
    return jsonify(serialize_settings(settings))


@settings_bp.route("/api/settings", methods=["PUT"])
@role_required("manage_users")
def update_settings():
    db = get_db()
    data = request.get_json() or {}

    allowed_fields = list(DEFAULT_SETTINGS.keys())
    update_data = {
        field: data[field]
        for field in allowed_fields
        if field in data
    }

    if not update_data:
        return jsonify({"error": "No valid fields provided for update"}), 400

    db.settings.update_one(
        {"id": "site"},
        {"$set": update_data},
        upsert=True,
    )

    settings = db.settings.find_one({"id": "site"})
    return jsonify({
        "message": "Settings updated successfully",
        "settings": serialize_settings(settings),
    })


@settings_bp.route("/api/settings/livestream", methods=["PUT"])
@role_required("manage_notifications")
def update_livestream():
    """Allow media staff to toggle live status and update the stream URL."""
    db = get_db()
    data = request.get_json() or {}

    update_data = {}
    if "is_live" in data:
        update_data["is_live"] = bool(data["is_live"])
    if "livestream_url" in data:
        update_data["livestream_url"] = data["livestream_url"]

    if not update_data:
        return jsonify({"error": "No livestream fields provided"}), 400

    db.settings.update_one(
        {"id": "site"},
        {"$set": update_data},
        upsert=True,
    )

    settings = db.settings.find_one({"id": "site"})
    return jsonify({
        "message": "Livestream settings updated",
        "settings": serialize_settings(settings),
    })
