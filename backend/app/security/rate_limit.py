import os
from flask import jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


def client_ip():
    if os.getenv("TRUST_PROXY", "").lower() in {"1", "true", "yes"}:
        forwarded = request.headers.get("X-Forwarded-For", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return get_remote_address()


limiter = Limiter(
    key_func=client_ip,
    default_limits=["120 per minute"],
    storage_uri=os.getenv("RATELIMIT_STORAGE_URI", "memory://"),
)


def rate_limit_exceeded(error):
    return jsonify({
        "error": "Too many requests. Please wait and try again.",
        "code": "rate_limited",
    }), 429
