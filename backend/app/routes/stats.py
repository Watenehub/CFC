from functools import wraps
from datetime import date
from flask import Blueprint, jsonify, session
from ..database.mongodb import get_db
from pymongo import ASCENDING, DESCENDING


stats_bp = Blueprint("stats", __name__)


def staff_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if not session.get("role"):
            return jsonify({"error": "Authentication required"}), 401
        if session.get("role") not in ("admin", "media", "secretary"):
            return jsonify({"error": "Access denied"}), 403
        return function(*args, **kwargs)
    return wrapper


@stats_bp.route("/api/dashboard/stats", methods=["GET"])
@staff_required
def get_dashboard_stats():
    db = get_db()
    today = date.today().isoformat()

    open_enquiries = db.enquiries.count_documents({"status": {"$in": ["New", "In Progress"]}})
    new_prayer = db.prayer_requests.count_documents({"status": "New"})

    upcoming_events = list(
        db.events.find(
            {"date": {"$gte": today}},
            {"_id": 0},
        ).sort("date", ASCENDING).limit(5)
    )

    return jsonify({
        "users": db.users.count_documents({}),
        "events": db.events.count_documents({}),
        "sermons": db.sermons.count_documents({}),
        "enquiries": db.enquiries.count_documents({}),
        "open_enquiries": open_enquiries,
        "prayer_requests": db.prayer_requests.count_documents({}),
        "new_prayer_requests": new_prayer,
        "giving": db.giving.count_documents({}),
        "gallery": db.gallery.count_documents({}),
        "ministries": db.ministries.count_documents({}),
        "pastors": db.pastors.count_documents({}),
        "deacons": db.deacons.count_documents({}),
        "notifications": db.notifications.count_documents({}),
        "services": db.services.count_documents({}),
        "recent_enquiries": [
            {
                "id": item.get("id"),
                "subject": item.get("subject", ""),
                "name": item.get("name", ""),
                "status": item.get("status", ""),
            }
            for item in list(db.enquiries.find({}, {"_id": 0}).sort("_id", DESCENDING).limit(5))
        ],
        "recent_sermons": [
            {
                "id": item.get("id"),
                "title": item.get("title", ""),
                "speaker": item.get("speaker", ""),
                "date": item.get("date", ""),
            }
            for item in list(db.sermons.find({}, {"_id": 0}).sort("_id", DESCENDING).limit(5))
        ],
        "upcoming_events": [
            {
                "id": item.get("id"),
                "title": item.get("title", ""),
                "date": item.get("date", ""),
                "location": item.get("location", ""),
            }
            for item in upcoming_events
        ],
    })
