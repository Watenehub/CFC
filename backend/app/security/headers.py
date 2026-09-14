import os
from flask import request
from .origins import cors_origin_for_request


API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"


def apply_security_headers(app, response):
    is_production = os.getenv("FLASK_ENV", "development") == "production"

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), "
        "magnetometer=(), microphone=(), payment=(), usb=()"
    )
    response.headers["X-XSS-Protection"] = "0"
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    response.headers["Content-Security-Policy"] = API_CSP
    response.headers.pop("Server", None)
    response.headers.pop("X-Powered-By", None)

    if is_production:
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )

    if request.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
    elif request.path.startswith("/uploads/"):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Content-Security-Policy"] = (
            "default-src 'none'; style-src 'none'; script-src 'none'"
        )

    origin = cors_origin_for_request()
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken, X-CSRF-Token"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Vary"] = "Origin"
    elif "Access-Control-Allow-Origin" in response.headers:
        # Never reflect an untrusted Origin.
        del response.headers["Access-Control-Allow-Origin"]

    return response
