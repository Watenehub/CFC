from .csrf import init_csrf
from .headers import apply_security_headers
from .sanitize import sanitize_request_json


def init_security(app):
    init_csrf(app)

    @app.before_request
    def _sanitize_json():
        sanitize_request_json()

    @app.after_request
    def _security_headers(response):
        return apply_security_headers(app, response)
