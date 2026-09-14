import os
import uuid
from flask import Blueprint, current_app, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from ..auth.permissions import login_required
from ..security.events import log_security_event
from ..security.images import inspect_image
from ..security.rate_limit import limiter

uploads_bp = Blueprint("uploads", __name__)

MAX_UPLOAD_BYTES = 8 * 1024 * 1024


def _uploads_dir():
    path = os.path.join(current_app.root_path, "..", "uploads")
    path = os.path.abspath(path)
    os.makedirs(path, exist_ok=True)
    return path


@uploads_bp.route("/api/upload", methods=["POST"])
@login_required
@limiter.limit("20 per minute")
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "No file selected"}), 400

    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_UPLOAD_BYTES:
        return jsonify({"error": "Image must be 8MB or smaller."}), 400

    extension, error = inspect_image(file)
    if error:
        log_security_event("upload_rejected", filename=secure_filename(file.filename), reason=error)
        return jsonify({"error": error}), 400

    filename = f"{uuid.uuid4().hex}.{extension}"
    destination = os.path.join(_uploads_dir(), filename)
    file.stream.seek(0)
    file.save(destination)

    base = request.host_url.rstrip("/")
    url = f"{base}/uploads/{filename}"
    log_security_event("upload_success", outcome="success", filename=filename)
    return jsonify({"url": url, "filename": filename}), 201


@uploads_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    safe_name = secure_filename(filename)
    if not safe_name or safe_name != os.path.basename(filename):
        return jsonify({"error": "Not found"}), 404
    return send_from_directory(_uploads_dir(), safe_name)
