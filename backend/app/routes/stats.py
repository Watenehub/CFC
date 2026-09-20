from functools import wraps
from datetime import date
from concurrent.futures import ThreadPoolExecutor
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

    def count(collection, query=None):
        return collection.count_documents(query or {})

    with ThreadPoolExecutor(max_workers=10) as executor:
        counts = list(executor.map(
            lambda task: count(task[0], task[1]),
            [
                (db.users, None),
                (db.events, None),
                (db.sermons, None),
                (db.enquiries, None),
                (db.enquiries, {"status": {"$in": ["New", "In Progress"]}}),
                (db.prayer_requests, None),
                (db.prayer_requests, {"status": "New"}),
                (db.giving, None),
                (db.gallery, None),
                (db.ministries, None),
                (db.pastors, None),
                (db.deacons, None),
                (db.notifications, None),
                (db.services, None),
            ],
        ))

    (
        users_count,
        events_count,
        sermons_count,
        enquiries_count,
        open_enquiries,
        prayer_requests_count,
        new_prayer,
        giving_count,
        gallery_count,
        ministries_count,
        pastors_count,
        deacons_count,
        notifications_count,
        services_count,
    ) = counts

    event_projection = {
        "_id": 0,
        "id": 1,
        "title": 1,
        "date": 1,
        "location": 1,
    }
    enquiry_projection = {
        "_id": 0,
        "id": 1,
        "subject": 1,
        "name": 1,
        "status": 1,
    }
    sermon_projection = {
        "_id": 0,
        "id": 1,
        "title": 1,
        "speaker": 1,
        "date": 1,
    }
    upcoming_events = list(
        db.events.find(
            {"date": {"$gte": today}},
            event_projection,
        ).sort("date", ASCENDING).limit(5)
    )

    return jsonify({
        "users": users_count,
        "events": events_count,
        "sermons": sermons_count,
        "enquiries": enquiries_count,
        "open_enquiries": open_enquiries,
        "prayer_requests": prayer_requests_count,
        "new_prayer_requests": new_prayer,
        "giving": giving_count,
        "gallery": gallery_count,
        "ministries": ministries_count,
        "pastors": pastors_count,
        "deacons": deacons_count,
        "notifications": notifications_count,
        "services": services_count,
        "recent_enquiries": [
            {
                "id": item.get("id"),
                "subject": item.get("subject", ""),
                "name": item.get("name", ""),
                "status": item.get("status", ""),
            }
            for item in list(db.enquiries.find({}, enquiry_projection).sort("_id", DESCENDING).limit(5))
        ],
        "recent_sermons": [
            {
                "id": item.get("id"),
                "title": item.get("title", ""),
                "speaker": item.get("speaker", ""),
                "date": item.get("date", ""),
            }
            for item in list(db.sermons.find({}, sermon_projection).sort("_id", DESCENDING).limit(5))
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
