from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required

events_bp = Blueprint("events", __name__)

events = []


@events_bp.route("/api/events", methods=["GET"])
def get_events():
    return jsonify(events)


@events_bp.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = next(
        (event for event in events if event["id"] == event_id),
        None
    )

    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify(event)


@events_bp.route("/api/events", methods=["POST"])
@role_required("manage_events")
def create_event():
    data = request.get_json() or {}

    event = {
        "id": len(events) + 1,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "date": data.get("date", ""),
        "start_time": data.get("start_time", ""),
        "end_time": data.get("end_time", ""),
        "location": data.get("location", ""),
        "image": data.get("image", ""),
        "organizer": data.get("organizer", ""),
        "registration_status": data.get("registration_status", "open"),
        "max_participants": data.get("max_participants"),
        "registration_deadline": data.get("registration_deadline")
    }

    events.append(event)

    return jsonify({
        "message": "Event created successfully",
        "event": event
    }), 201


@events_bp.route("/api/events/<int:event_id>", methods=["PUT"])
@role_required("manage_events")
def update_event(event_id):
    event = next(
        (event for event in events if event["id"] == event_id),
        None
    )

    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json() or {}

    for field in [
        "title",
        "description",
        "date",
        "start_time",
        "end_time",
        "location",
        "image",
        "organizer",
        "registration_status",
        "max_participants",
        "registration_deadline"
    ]:
        if field in data:
            event[field] = data[field]

    return jsonify({
        "message": "Event updated successfully",
        "event": event
    })


@events_bp.route("/api/events/<int:event_id>", methods=["DELETE"])
@role_required("manage_events")
def delete_event(event_id):
    event = next(
        (event for event in events if event["id"] == event_id),
        None
    )

    if not event:
        return jsonify({"error": "Event not found"}), 404

    events.remove(event)

    return jsonify({
        "message": "Event deleted successfully"
    })