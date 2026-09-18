from flask import Flask, Blueprint, make_response, request
from .config import Config
from .database.mongodb import init_mongo
from flask_cors import CORS
import importlib
import logging
import os
import pkgutil
import re

from . import routes
from .auth.routes import auth_bp
# from .security import init_security
# from .security.headers import apply_security_headers
from .security.origins import get_allowed_origins
from flask import jsonify
# from .security.rate_limit import limiter, rate_limit_exceeded
# from .security.events import log_security_event


def _cors_origins():
    origins = list(get_allowed_origins())
    pattern = os.getenv("FRONTEND_ORIGIN_REGEX", "").strip()
    if pattern:
        origins.append(re.compile(pattern))
    return origins


def create_app():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SECRET_KEY"] = Config.SECRET_KEY

    if not app.config["SECRET_KEY"] or app.config["SECRET_KEY"] in {"changeme", "secret", "dev"}:
        raise RuntimeError("SECRET_KEY must be set to a long random value.")

    if not Config.MONGO_URI:
        raise RuntimeError("MONGO_URI is not configured.")

    if os.getenv("TRUST_PROXY", "").lower() in {"1", "true", "yes"}:
        from werkzeug.middleware.proxy_fix import ProxyFix
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    init_mongo(app)
    # limiter.init_app(app)
    # app.register_error_handler(429, rate_limit_exceeded)

    # Temporarily disable FRONTEND_ORIGINS check for debugging
    # if os.getenv("FLASK_ENV") == "production" and not get_allowed_origins() and not os.getenv("FRONTEND_ORIGIN_REGEX"):
    #     raise RuntimeError("Set FRONTEND_ORIGINS to your live site URL(s) before running in production.")

    # Allow specific frontend origin (cannot use * with credentials)
    CORS(
        app,
        resources={r"/*": {"origins": ["https://cfckenya.vercel.app", "http://localhost:3000", "http://localhost:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "X-CSRFToken", "X-CSRF-Token"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # init_security(app)

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
        # Simple CSRF token endpoint - returns a dummy token
        # CSRF protection is disabled but frontend expects this endpoint
        return jsonify({"csrf_token": "dummy-token"})

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            # Security headers disabled temporarily
            # return apply_security_headers(app, make_response("", 204))
            return make_response("", 204)

    @app.after_request
    def audit_auth_failures(response):
        skip = {"/api/auth/me", "/api/csrf-token", "/api/health"}
        if (
            request.path.startswith("/api/")
            and request.path not in skip
            and response.status_code in {401, 403}
        ):
            log_security_event(
                "unauthorized_access" if response.status_code == 401 else "access_denied",
                status=response.status_code,
            )
        return response

    return app
