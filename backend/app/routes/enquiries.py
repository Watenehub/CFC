from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required

enquiries_bp = Blueprint("enquiries", __name__)

enquiries = []


@enquiries_bp.route("/api/enquiries", methods=["GET"])
@role_required("manage_enquiries")
def get_enquiries():
    return jsonify(enquiries)


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["GET"])
@role_required("manage_enquiries")
def get_enquiry(enquiry_id):
    enquiry = next(
        (item for item in enquiries if item["id"] == enquiry_id),
        None
    )

    if not enquiry:
        return jsonify({"error": "Enquiry not found"}), 404

    return jsonify(enquiry)


@enquiries_bp.route("/api/enquiries", methods=["POST"])
def create_enquiry():
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

    enquiry = {
        "id": len(enquiries) + 1,
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "subject": data["subject"],
        "message": data["message"],
        "status": "New",
        "response": ""
    }

    enquiries.append(enquiry)

    return jsonify({
        "message": "Enquiry submitted successfully",
        "enquiry": enquiry
    }), 201


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["PUT"])
@role_required("manage_enquiries")
def update_enquiry(enquiry_id):
    enquiry = next(
        (item for item in enquiries if item["id"] == enquiry_id),
        None
    )

    if not enquiry:
        return jsonify({"error": "Enquiry not found"}), 404

    data = request.get_json() or {}

    if "status" in data:
        enquiry["status"] = data["status"]

    if "response" in data:
        enquiry["response"] = data["response"]

    return jsonify({
        "message": "Enquiry updated successfully",
        "enquiry": enquiry
    })


@enquiries_bp.route("/api/enquiries/<int:enquiry_id>", methods=["DELETE"])
@role_required("manage_enquiries")
def delete_enquiry(enquiry_id):
    enquiry = next(
        (item for item in enquiries if item["id"] == enquiry_id),
        None
    )

    if not enquiry:
        return jsonify({"error": "Enquiry not found"}), 404

    enquiries.remove(enquiry)

    return jsonify({
        "message": "Enquiry deleted successfully"
    })