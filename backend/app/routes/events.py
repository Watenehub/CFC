from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


events_bp = Blueprint("events", __name__)


def serialize_event(event):
    """Convert MongoDB document into a JSON-safe API response."""
    if event is None:
        return None

    event = event.copy()
    event.pop("_id", None)

    return event


@events_bp.route("/api/events", methods=["GET"])
def get_events():
    """Get all events."""
    db = get_db()

    events = list(
        db.events.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_event(event)
        for event in events
    ])


@events_bp.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """Get a single event by ID."""
    db = get_db()

    event = db.events.find_one({
        "id": event_id
    })

    if not event:
        return jsonify({
            "error": "Event not found"
        }), 404

    return jsonify(
        serialize_event(event)
    )


@events_bp.route("/api/events", methods=["POST"])
@role_required("manage_events")
def create_event():
    """Create a new event."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_event = db.events.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_event["id"] + 1
        if last_event
        else 1
    )

    event = {
        "id": next_id,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "date": data.get("date", ""),
        "start_time": data.get("start_time", ""),
        "end_time": data.get("end_time", ""),
        "location": data.get("location", ""),
        "map_url": data.get("map_url", ""),
        "image": data.get("image", ""),
        "organizer": data.get("organizer", ""),
        "registration_status": data.get(
            "registration_status",
            "open"
        ),
        "max_participants": data.get(
            "max_participants"
        ),
        "registration_deadline": data.get(
            "registration_deadline"
        )
    }

    db.events.insert_one(event)

    return jsonify({
        "message": "Event created successfully",
        "event": serialize_event(event)
    }), 201


@events_bp.route("/api/events/<int:event_id>", methods=["PUT"])
@role_required("manage_events")
def update_event(event_id):
    """Update an existing event."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "title",
        "description",
        "date",
        "start_time",
        "end_time",
        "location",
        "map_url",
        "image",
        "organizer",
        "registration_status",
        "max_participants",
        "registration_deadline"
    ]

    update_data = {
        field: data[field]
        for field in allowed_fields
        if field in data
    }

    if not update_data:
        return jsonify({
            "error": "No valid fields provided for update"
        }), 400

    result = db.events.update_one(
        {
            "id": event_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({
            "error": "Event not found"
        }), 404

    event = db.events.find_one({
        "id": event_id
    })

    return jsonify({
        "message": "Event updated successfully",
        "event": serialize_event(event)
    })


@events_bp.route("/api/events/<int:event_id>", methods=["DELETE"])
@role_required("manage_events")
def delete_event(event_id):
    """Delete an event."""
    db = get_db()

    result = db.events.delete_one({
        "id": event_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "error": "Event not found"
        }), 404

    return jsonify({
        "message": "Event deleted successfully"
    })