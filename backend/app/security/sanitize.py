import bleach
from flask import request

MAX_STRING_LENGTH = 10_000
PASSWORD_KEYS = {
    "password",
    "old_password",
    "new_password",
    "confirm_password",
    "token",
    "csrf_token",
}


def sanitize_text(value, max_length=MAX_STRING_LENGTH):
    if not isinstance(value, str):
        return value
    cleaned = bleach.clean(value, tags=[], attributes={}, strip=True)
    return cleaned[:max_length]


def sanitize_payload(value, key=None):
    if isinstance(value, dict):
        return {
            nested_key: sanitize_payload(nested_value, nested_key)
            for nested_key, nested_value in value.items()
        }
    if isinstance(value, list):
        return [sanitize_payload(item, key) for item in value]
    if isinstance(value, str) and (key or "").lower() not in PASSWORD_KEYS:
        return sanitize_text(value)
    return value


def sanitize_request_json():
    if request.method in {"GET", "HEAD", "OPTIONS"}:
        return
    if not request.mimetype or "json" not in request.mimetype:
        return
    data = request.get_json(silent=True)
    if data is None:
        return
    sanitized = sanitize_payload(data)
    cache = getattr(request, "_cached_json", None)
    if isinstance(cache, dict):
        request._cached_json[False] = sanitized
        request._cached_json[True] = sanitized
    else:
        request._cached_json = (sanitized, sanitized)
