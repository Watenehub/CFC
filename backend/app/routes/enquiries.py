from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


enquiries_bp = Blueprint("enquiries", __name__)


def serialize_enquiry(enquiry):
    """Convert MongoDB document into a JSON-safe API response."""
    if enquiry is None:
        return None

    enquiry = enquiry.copy()
    enquiry.pop("_id", None)

    return enquiry


@enquiries_bp.route("/api/enquiries", methods=["GET"])
@role_required("manage_enquiries")
def get_enquiries():
    """Get all enquiries."""
    db = get_db()

    enquiries = list(
        db.enquiries.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_enquiry(enquiry)
        for enquiry in enquiries
    ])


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["GET"])
@role_required("manage_enquiries")
def get_enquiry(enquiry_id):
    """Get a single enquiry by ID."""
    db = get_db()

    enquiry = db.enquiries.find_one({
        "id": enquiry_id
    })

    if not enquiry:
        return jsonify({"error": "Enquiry not found"}), 404

    return jsonify(
        serialize_enquiry(enquiry)
    )


@enquiries_bp.route("/api/enquiries", methods=["POST"])
def create_enquiry():
    """Create a new enquiry (public endpoint)."""
    db = get_db()

    data = request.get_json() or {}

    required_fields = [
        "name",
        "email",
        "subject",
        "message"
    ]

    missing_fields = [
        field for field in required_fields
        if not data.get(field)
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing_fields
        }), 400

    # Generate the next integer ID
    last_enquiry = db.enquiries.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_enquiry["id"] + 1
        if last_enquiry
        else 1
    )

    enquiry = {
        "id": next_id,
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "subject": data["subject"],
        "message": data["message"],
        "status": "New",
        "response": ""
    }

    db.enquiries.insert_one(enquiry)

    return jsonify({
        "message": "Enquiry submitted successfully",
        "enquiry": serialize_enquiry(enquiry)
    }), 201


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["PUT"])
@role_required("manage_enquiries")
def update_enquiry(enquiry_id):
    """Update an existing enquiry."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "status",
        "response"
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

    result = db.enquiries.update_one(
        {
            "id": enquiry_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Enquiry not found"}), 404

    enquiry = db.enquiries.find_one({
        "id": enquiry_id
    })

    return jsonify({
        "message": "Enquiry updated successfully",
        "enquiry": serialize_enquiry(enquiry)
    })


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["DELETE"])
@role_required("manage_enquiries")
def delete_enquiry(enquiry_id):
    """Delete an enquiry."""
    db = get_db()

    result = db.enquiries.delete_one({
        "id": enquiry_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Enquiry not found"}), 404

    return jsonify({
        "message": "Enquiry deleted successfully"
    })