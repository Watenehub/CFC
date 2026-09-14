import os
import re
from flask import request


LOCAL_ORIGINS = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}


def _configured_origins():
    raw = os.getenv("FRONTEND_ORIGINS", "")
    origins = {item.strip().rstrip("/") for item in raw.split(",") if item.strip()}
    flask_env = os.getenv("FLASK_ENV", "development")
    if flask_env != "production":
        origins.update(LOCAL_ORIGINS)
    return origins


def get_allowed_origins():
    return _configured_origins()


def origin_is_allowed(origin):
    if not origin:
        return False
    normalized = origin.rstrip("/")
    if normalized in _configured_origins():
        return True
    pattern = os.getenv("FRONTEND_ORIGIN_REGEX", "").strip()
    if pattern:
        try:
            return re.fullmatch(pattern, origin) is not None
        except re.error:
            return False
    return False


def cors_origin_for_request():
    origin = request.headers.get("Origin")
    if origin_is_allowed(origin):
        return origin
    return None
