import os
import uuid
from flask import Blueprint, current_app, jsonify, request, send_from_directory, url_for
from werkzeug.utils import secure_filename
from ..auth.permissions import login_required


uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


def _uploads_dir():
    path = os.path.join(current_app.root_path, "..", "uploads")
    path = os.path.abspath(path)
    os.makedirs(path, exist_ok=True)
    return path


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@uploads_bp.route("/api/upload", methods=["POST"])
@login_required
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "No file selected"}), 400

    if not _allowed(file.filename):
        return jsonify({"error": "Unsupported file type. Use PNG, JPG, GIF, or WebP."}), 400

    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_UPLOAD_BYTES:
        return jsonify({"error": "Image must be 8MB or smaller."}), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    destination = os.path.join(_uploads_dir(), filename)
    file.save(destination)

    # Absolute URL so the frontend can load images from the API host
    base = request.host_url.rstrip("/")
    url = f"{base}/uploads/{filename}"

    return jsonify({"url": url, "filename": filename}), 201


@uploads_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    return send_from_directory(_uploads_dir(), filename)
