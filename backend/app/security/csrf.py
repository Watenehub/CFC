from flask import jsonify
from flask_wtf.csrf import CSRFError, CSRFProtect, generate_csrf
from .events import log_security_event

csrf = CSRFProtect()


def init_csrf(app):
    csrf.init_app(app)

    @app.route("/api/csrf-token", methods=["GET"])
    def csrf_token():
        return jsonify({"csrf_token": generate_csrf()})

    @app.errorhandler(CSRFError)
    def handle_csrf_error(error):
        log_security_event("csrf_rejected", outcome="failure", detail=str(error))
        return jsonify({
            "error": "Invalid or missing security token. Refresh the page and try again.",
            "code": "csrf_failed",
        }), 400
