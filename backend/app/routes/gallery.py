from flask import Blueprint, jsonify, request
from ..auth.permissions import role_required
from ..database.mongodb import get_db
from pymongo import DESCENDING


gallery_bp = Blueprint("gallery", __name__)


def serialize_gallery_item(item):
    """Convert MongoDB document into a JSON-safe API response."""
    if item is None:
        return None

    item = item.copy()
    item.pop("_id", None)

    return item


@gallery_bp.route("/api/gallery", methods=["GET"])
def get_gallery():
    """Get all gallery items."""
    db = get_db()

    gallery = list(
        db.gallery.find().sort("_id", DESCENDING)
    )

    return jsonify([
        serialize_gallery_item(item)
        for item in gallery
    ])


@gallery_bp.route("/api/gallery/<int:item_id>", methods=["GET"])
def get_gallery_item(item_id):
    """Get a single gallery item by ID."""
    db = get_db()

    item = db.gallery.find_one({
        "id": item_id
    })

    if not item:
        return jsonify({"error": "Gallery item not found"}), 404

    return jsonify(
        serialize_gallery_item(item)
    )


@gallery_bp.route("/api/gallery", methods=["POST"])
@role_required("manage_gallery")
def create_gallery_item():
    """Create a new gallery item."""
    db = get_db()

    data = request.get_json() or {}

    # Generate the next integer ID
    last_item = db.gallery.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_item["id"] + 1
        if last_item
        else 1
    )

    item = {
        "id": next_id,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "image_url": data.get("image_url", ""),
        "category": data.get("category", ""),
        "date": data.get("date", ""),
        "featured": data.get("featured", False)
    }

    db.gallery.insert_one(item)

    return jsonify({
        "message": "Gallery item created successfully",
        "item": serialize_gallery_item(item)
    }), 201


@gallery_bp.route("/api/gallery/<int:item_id>", methods=["PUT"])
@role_required("manage_gallery")
def update_gallery_item(item_id):
    """Update an existing gallery item."""
    db = get_db()

    data = request.get_json() or {}

    allowed_fields = [
        "title",
        "description",
        "image_url",
        "category",
        "date",
        "featured"
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

    result = db.gallery.update_one(
        {
            "id": item_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Gallery item not found"}), 404

    item = db.gallery.find_one({
        "id": item_id
    })

    return jsonify({
        "message": "Gallery item updated successfully",
        "item": serialize_gallery_item(item)
    })


@gallery_bp.route("/api/gallery/<int:item_id>", methods=["DELETE"])
@role_required("manage_gallery")
def delete_gallery_item(item_id):
    """Delete a gallery item."""
    db = get_db()

    result = db.gallery.delete_one({
        "id": item_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Gallery item not found"}), 404

    return jsonify({
        "message": "Gallery item deleted successfully"
    })
