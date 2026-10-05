import os
import uuid
import warnings
from io import BytesIO

import gridfs
from PIL import Image, ImageOps, UnidentifiedImageError
from flask import Blueprint, current_app, jsonify, request, send_file
from werkzeug.utils import secure_filename

from ..auth.permissions import roles_required
from ..database.mongodb import get_db
from ..security import audit_event

uploads_bp = Blueprint("uploads", __name__)
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


def _uploads_dir():
    path = os.path.abspath(os.path.join(current_app.root_path, "..", "uploads"))
    os.makedirs(path, exist_ok=True)
    return path


def _normalize_image(stream, claimed_extension=None):
    stream.seek(0)
    with warnings.catch_warnings():
        warnings.simplefilter("error", Image.DecompressionBombWarning)
        source = Image.open(stream)
        if source.format not in {"JPEG", "PNG", "WEBP"}:
            raise ValueError("Unsupported image content")
        actual_extension = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}[source.format]
        if claimed_extension and actual_extension != ("jpg" if claimed_extension == "jpeg" else claimed_extension):
            raise ValueError("Image content does not match the file extension")
        if source.width * source.height > current_app.config["MAX_IMAGE_PIXELS"]:
            raise ValueError("Image dimensions exceed the allowed limit")
        if max(source.size) > current_app.config["MAX_IMAGE_SIDE"]:
            raise ValueError("Image dimensions exceed the allowed limit")
        image_format = source.format
        source.verify()
        stream.seek(0)
        image = ImageOps.exif_transpose(Image.open(stream))
        image.thumbnail((1920, 1920))
        if image_format == "JPEG":
            image = image.convert("RGB")
            extension, content_type = "jpg", "image/jpeg"
        elif image_format == "PNG":
            image = image.convert("RGBA") if "A" in image.getbands() else image.convert("RGB")
            extension, content_type = "png", "image/png"
        else:
            image = image.convert("RGBA") if "A" in image.getbands() else image.convert("RGB")
            extension, content_type = "webp", "image/webp"

        output = BytesIO()
        image.save(output, format=image_format, quality=82, optimize=True)

    if output.tell() > MAX_UPLOAD_BYTES:
        raise ValueError("Processed image exceeds the maximum allowed size")
    output.seek(0)
    return output, extension, content_type


def _safe_stored_image(filename, stream):
    try:
        normalized, extension, content_type = _normalize_image(stream)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        current_app.logger.warning("Rejected invalid stored image %s", filename)
        return jsonify({"error": "Not found"}), 404

    response = send_file(
        normalized,
        mimetype=content_type,
        download_name=f"{os.path.splitext(filename)[0]}.{extension}",
        conditional=True,
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = "default-src 'none'; sandbox"
    response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


@uploads_bp.route("/api/upload", methods=["POST"])
@roles_required("admin", "media", "secretary")
def upload_file():
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "No file selected"}), 400

    safe_original_name = secure_filename(file.filename)
    extension = safe_original_name.rsplit(".", 1)[-1].lower() if "." in safe_original_name else ""
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Only JPEG, PNG, and WebP images are accepted."}), 415
    expected_mime = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
    }[extension]
    if file.mimetype != expected_mime:
        return jsonify({"error": "File extension and MIME type do not match."}), 415

    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(0)
    if size > MAX_UPLOAD_BYTES:
        return jsonify({"error": "Image must be 8MB or smaller."}), 413

    try:
        normalized, extension, content_type = _normalize_image(file.stream, extension)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        return jsonify({"error": "The uploaded file is not a valid safe image."}), 400

    filename = f"{uuid.uuid4().hex}.{extension}"
    gridfs.GridFS(get_db()).put(normalized, filename=filename, content_type=content_type)
    audit_event("upload_created", target_id=filename)
    url = f"{request.host_url.rstrip('/')}/uploads/{filename}"
    return jsonify({"url": url, "filename": filename}), 201


@uploads_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    safe_name = secure_filename(filename)
    if not safe_name or safe_name != os.path.basename(filename):
        return jsonify({"error": "Not found"}), 404
    extension = safe_name.rsplit(".", 1)[-1].lower() if "." in safe_name else ""
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Not found"}), 404

    stored_file = gridfs.GridFS(get_db()).find_one({"filename": safe_name})
    if stored_file:
        return _safe_stored_image(safe_name, stored_file)

    local_path = os.path.join(_uploads_dir(), safe_name)
    if not os.path.isfile(local_path):
        return jsonify({"error": "Not found"}), 404
    with open(local_path, "rb") as stream:
        return _safe_stored_image(safe_name, stream)