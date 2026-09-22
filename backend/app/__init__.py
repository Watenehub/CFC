from flask import Flask, Blueprint, make_response, request, jsonify
from .config import Config
from .database.mongodb import init_mongo
from flask_cors import CORS
import importlib
import logging
import os
import pkgutil

from . import routes
from .auth.routes import auth_bp


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

    CORS(
        app,
        resources={r"/*": {"origins": ["https://cfckenya.vercel.app", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:5173", "http://127.0.0.1:5174"]}},
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
        # Simple CSRF token endpoint for frontend compatibility
        # Returns a dummy token since CSRF protection is not implemented
        return jsonify({"csrf_token": "dummy-token"})

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            return make_response("", 204)

    return app
