import io
from PIL import Image, UnidentifiedImageError

ALLOWED_IMAGE_FORMATS = {
    "JPEG": "jpg",
    "PNG": "png",
    "GIF": "gif",
    "WEBP": "webp",
}

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
}


def inspect_image(file_storage):
    declared = (file_storage.mimetype or "").lower()
    if declared not in ALLOWED_MIME_TYPES:
        return None, "Unsupported file type. Use PNG, JPG, GIF, or WebP."

    payload = file_storage.read()
    file_storage.stream.seek(0)
    if not payload:
        return None, "Empty file"

    try:
        with Image.open(io.BytesIO(payload)) as image:
            image.verify()
        with Image.open(io.BytesIO(payload)) as image:
            fmt = (image.format or "").upper()
            image.load()
    except (UnidentifiedImageError, OSError, ValueError):
        return None, "File is not a valid image."

    extension = ALLOWED_IMAGE_FORMATS.get(fmt)
    if not extension:
        return None, "Unsupported image format."

    return extension, None
