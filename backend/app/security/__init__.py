# from .headers import apply_security_headers
# from .sanitize import sanitize_request_json


def init_security(app):
    # CSRF protection disabled temporarily - requires frontend updates
    # from .csrf import init_csrf
    # init_csrf(app)

    # Input sanitization disabled temporarily - causing request issues
    # @app.before_request
    # def _sanitize_json():
    #     sanitize_request_json()

    # Security headers disabled temporarily - causing CORS issues
    # @app.after_request
    # def _security_headers(response):
    #     return apply_security_headers(app, response)
    pass
