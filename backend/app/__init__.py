from flask import Flask, Blueprint, make_response, request, jsonify, session, g
from werkzeug.exceptions import HTTPException
from .config import Config
from .database.mongodb import init_mongo
from flask_cors import CORS
from flask_wtf.csrf import CSRFError, generate_csrf
import importlib
import logging
import os
import pkgutil

from . import routes
from .auth.routes import auth_bp
from .security import csrf, limiter


def create_app(test_config=None):
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    app.config["SECRET_KEY"] = app.config.get("SECRET_KEY")

    if not app.config.get("TESTING") and (
        not app.config["SECRET_KEY"]
        or app.config["SECRET_KEY"] in {"changeme", "secret", "dev"}
        or len(app.config["SECRET_KEY"]) < 32
    ):
        raise RuntimeError("SECRET_KEY must be set to a long random value.")

    if not app.config.get("TESTING") and not app.config.get("MONGO_URI"):
        raise RuntimeError("MONGO_URI is not configured.")

    if os.getenv("TRUST_PROXY", "").lower() in {"1", "true", "yes"}:
        from werkzeug.middleware.proxy_fix import ProxyFix
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    if app.config.get("TESTING"):
        app.extensions["mongo_db"] = app.config["TEST_MONGO_DB"]
    else:
        init_mongo(app)

    csrf.init_app(app)
    limiter.init_app(app)

    CORS(
        app,
        resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "X-CSRFToken", "X-CSRF-Token"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    for _, module_name, _ in pkgutil.iter_modules(routes.__path__):
        module = importlib.import_module(
            f"{routes.__name__}.{module_name}"
        )

        for name in dir(module):
            obj = getattr(module, name)

            if isinstance(obj, Blueprint):
                app.register_blueprint(obj)

    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return "Cornerstone Family Chapel API is running!"

    @app.route("/api/health", methods=["GET"])
    def health():
        return {
            "status": "success",
            "message": "Cornerstone Family Chapel API is healthy"
        }

    @app.route("/api/csrf-token", methods=["GET"])
    def csrf_token():
        return jsonify({"csrf_token": generate_csrf()})

    @app.errorhandler(400)
    def bad_request(error):
        if getattr(error, "description", "") == "The CSRF token is missing.":
            return jsonify({"error": "CSRF validation failed", "code": "csrf_failed"}), 400
        if request.path.startswith("/api/"):
            return jsonify({"error": "Invalid request"}), 400
        return error

    @app.errorhandler(CSRFError)
    def csrf_error(error):
        if not request.path.startswith("/api/"):
            return error
        if not session.get("user_id"):
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({"error": "CSRF validation failed", "code": "csrf_failed"}), 400

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify({"error": "Request exceeds the maximum allowed size"}), 413

    @app.errorhandler(429)
    def rate_limited(_error):
        return jsonify({"error": "Too many requests. Please try again later."}), 429

    @app.errorhandler(Exception)
    def safe_api_error(error):
        if isinstance(error, HTTPException):
            if request.path.startswith("/api/"):
                return jsonify({"error": error.name}), error.code
            return error
        app.logger.exception("Unhandled request error")
        if request.path.startswith("/api/"):
            return jsonify({"error": "Internal server error"}), 500
        return "Internal server error", 500

    @app.after_request
    def security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.headers.setdefault("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
        response.headers.setdefault("X-Frame-Options", "DENY")
        if app.config.get("IS_PRODUCTION"):
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000")
        return response

    @app.before_request
    def handle_preflight():
        g.request_id = request.headers.get("X-Request-ID", "")[:100] or os.urandom(16).hex()
        if request.method == "OPTIONS":
            return make_response("", 204)

    @app.after_request
    def audit_state_changes(response):
        if (
            request.path.startswith("/api/")
            and request.method in {"POST", "PUT", "PATCH", "DELETE"}
            and not getattr(g, "security_audit_recorded", False)
        ):
            from .security import audit_event
            audit_event(f"{request.method.lower()}_request", target_id=request.path, success=response.status_code < 400)
        response.headers.setdefault("X-Request-ID", getattr(g, "request_id", ""))
        return response

    return app
