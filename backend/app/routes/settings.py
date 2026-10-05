from flask import Blueprint, jsonify, request
from urllib.parse import urlsplit
from ..auth.permissions import admin_required, role_required
from ..database.mongodb import get_db
from ..security import audit_event, safe_web_url


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
    "motto": "Bible plus nothing. Bible minus nothing.",
    "beliefs": "We believe in one God — Father, Son, and Holy Spirit — and that salvation is found in Jesus Christ alone. Scripture is our authority for faith and life.",
}


def serialize_settings(settings):
    if settings is None:
        return DEFAULT_SETTINGS.copy()

    public = {field: settings.get(field, default) for field, default in DEFAULT_SETTINGS.items()}
    public["map_url"] = safe_web_url(public.get("map_url"), allow_relative=False) or DEFAULT_SETTINGS["map_url"]
    livestream_url = safe_web_url(public.get("livestream_url"), allow_relative=False)
    host = urlsplit(livestream_url).hostname or ""
    if host not in {"youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"}:
        livestream_url = DEFAULT_SETTINGS["livestream_url"]
    public["livestream_url"] = livestream_url
    return public


@settings_bp.route("/api/settings", methods=["GET"])
def get_settings():
    """Get site settings (public endpoint)."""
    db = get_db()
    settings = db.settings.find_one({"id": "site"})
    response = jsonify(serialize_settings(settings))
    response.headers["Cache-Control"] = "no-store, no-cache, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    return response


@settings_bp.route("/api/settings", methods=["PUT"])
@admin_required
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

    text_fields = ("church_name", "address", "phone", "email", "service_times", "office_hours", "mission", "vision", "motto", "beliefs")
    for field in text_fields:
        value = update_data.get(field)
        if value is not None and (not isinstance(value, str) or len(value) > 10000):
            return jsonify({"error": f"Invalid value for {field}"}), 400

    for field in ("map_url",):
        value = update_data.get(field)
        if value is not None and (not isinstance(value, str) or (value and not value.startswith("https://"))):
            return jsonify({"error": f"{field} must be an HTTPS URL"}), 400

    if "livestream_url" in update_data:
        url = update_data["livestream_url"]
        if not isinstance(url, str) or len(url) > 2048 or not (
            url.startswith("https://www.youtube.com/")
            or url.startswith("https://youtube.com/")
            or url.startswith("https://www.youtube-nocookie.com/")
        ):
            return jsonify({"error": "Livestream URL must be a valid HTTPS YouTube URL"}), 400

    if "is_live" in update_data and not isinstance(update_data["is_live"], bool):
        return jsonify({"error": "is_live must be a boolean"}), 400

    db.settings.update_one(
        {"id": "site"},
        {"$set": update_data},
        upsert=True,
    )
    audit_event("site_settings_updated", target_id="site")

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
        if not isinstance(data["is_live"], bool):
            return jsonify({"error": "is_live must be a boolean"}), 400
        update_data["is_live"] = data["is_live"]
    if "livestream_url" in data:
        url = data["livestream_url"]
        if not isinstance(url, str) or len(url) > 2048 or not (
            url.startswith("https://www.youtube.com/")
            or url.startswith("https://youtube.com/")
            or url.startswith("https://www.youtube-nocookie.com/")
        ):
            return jsonify({"error": "Livestream URL must be a valid HTTPS YouTube URL"}), 400
        update_data["livestream_url"] = data["livestream_url"]

    if not update_data:
        return jsonify({"error": "No livestream fields provided"}), 400

    db.settings.update_one(
        {"id": "site"},
        {"$set": update_data},
        upsert=True,
    )
    audit_event("livestream_settings_updated", target_id="site")

    settings = db.settings.find_one({"id": "site"})
    return jsonify({
        "message": "Livestream settings updated",
        "settings": serialize_settings(settings),
    })
