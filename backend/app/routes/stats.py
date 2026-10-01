from datetime import date
from concurrent.futures import ThreadPoolExecutor
from flask import Blueprint, jsonify
from ..auth.permissions import get_session_user, roles_required
from ..database.mongodb import get_db
from pymongo import ASCENDING, DESCENDING


stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/api/dashboard/stats", methods=["GET"])
@roles_required("admin", "media", "secretary")
def get_dashboard_stats():
    db = get_db()
    role = get_session_user()["role"]
    today = date.today().isoformat()

    def count(collection, query=None):
        return collection.count_documents(query or {})

    count_tasks = {
        "admin": [
            ("users", db.users, None), ("events", db.events, None),
            ("sermons", db.sermons, None), ("enquiries", db.enquiries, None),
            ("open_enquiries", db.enquiries, {"status": {"$in": ["New", "In Progress"]}}),
            ("prayer_requests", db.prayer_requests, None),
            ("new_prayer_requests", db.prayer_requests, {"status": "New"}),
            ("giving", db.giving, None), ("gallery", db.gallery, None),
            ("ministries", db.ministries, None), ("pastors", db.pastors, None),
            ("deacons", db.deacons, None), ("notifications", db.notifications, None),
            ("services", db.services, None),
        ],
        "media": [
            ("events", db.events, None), ("sermons", db.sermons, None),
            ("gallery", db.gallery, None), ("notifications", db.notifications, {"active": True}),
        ],
        "secretary": [
            ("enquiries", db.enquiries, None),
            ("open_enquiries", db.enquiries, {"status": {"$in": ["New", "In Progress"]}}),
            ("prayer_requests", db.prayer_requests, None),
            ("new_prayer_requests", db.prayer_requests, {"status": "New"}),
            ("giving", db.giving, None), ("services", db.services, None),
        ],
    }[role]

    with ThreadPoolExecutor(max_workers=min(10, len(count_tasks))) as executor:
        counts = dict(executor.map(lambda task: (task[0], count(task[1], task[2])), count_tasks))

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
    result = dict(counts)
    if role in {"admin", "media"}:
        upcoming_events = list(
            db.events.find({"date": {"$gte": today}, "status": {"$ne": "draft"}}, event_projection)
            .sort("date", ASCENDING).limit(5)
        )
        result["upcoming_events"] = [
            {
                "id": item.get("id"),
                "title": item.get("title", ""),
                "date": item.get("date", ""),
                "location": item.get("location", ""),
            }
            for item in upcoming_events
        ]
        result["recent_sermons"] = [
            {"id": item.get("id"), "title": item.get("title", ""), "speaker": item.get("speaker", ""), "date": item.get("date", "")}
            for item in list(db.sermons.find({"status": {"$ne": "draft"}}, sermon_projection).sort("_id", DESCENDING).limit(5))
        ]
    if role in {"admin", "secretary"}:
        result["recent_enquiries"] = [
            {
                "id": item.get("id"),
                "subject": item.get("subject", ""),
                "name": item.get("name", ""),
                "status": item.get("status", ""),
            }
            for item in list(db.enquiries.find({}, enquiry_projection).sort("_id", DESCENDING).limit(5))
        ]
    return jsonify(result)
