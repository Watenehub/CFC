from flask import Flask, Blueprint, request
from .config import Config
from flask_cors import CORS
import importlib
import pkgutil

from . import routes
from .auth.routes import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend development and Vercel deployment
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:3001",
                    "http://127.0.0.1:3001",
                ]
            }
        },
        supports_credentials=True
    )

    # Use the secret key from the environment configuration
    app.secret_key = Config.SECRET_KEY

    # Automatically discover and register route blueprints
    for _, module_name, _ in pkgutil.iter_modules(routes.__path__):
        module = importlib.import_module(
            f"{routes.__name__}.{module_name}"
        )

        for name in dir(module):
            obj = getattr(module, name)

            if isinstance(obj, Blueprint):
                app.register_blueprint(obj)

    # Register authentication routes
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

    # Ensure CORS headers are present
    @app.after_request
    def add_cors_headers(response):
        request_origin = request.headers.get("Origin")

        allowed_origins = {
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        }

        # Allow localhost and Vercel deployments
        if request_origin and (
            "vercel.app" in request_origin
            or request_origin in allowed_origins
        ):
            response.headers["Access-Control-Allow-Origin"] = request_origin
        else:
            response.headers["Access-Control-Allow-Origin"] = (
                "http://localhost:3000"
            )

        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = (
            "GET,POST,PUT,DELETE,OPTIONS"
        )

        return response

    return app