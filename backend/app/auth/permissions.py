from functools import wraps
from flask import jsonify, session


ROLE_PERMISSIONS = {
    "admin": [
        "manage_users",
        "manage_events",
        "manage_sermons",
        "manage_giving",
        "manage_enquiries",
        "manage_pastors",
        "manage_deacons",
        "manage_ministries",
        "manage_services",
        "manage_notifications",
        "manage_gallery",
    ],
    "media": [
        "manage_events",
        "manage_sermons",
        "manage_gallery",
        "manage_notifications",
    ],
    "secretary": [
        "manage_giving",
        "manage_enquiries",
        "manage_services",
    ],
}


def has_permission(role, permission):
    return permission in ROLE_PERMISSIONS.get(role, [])


def effective_permissions(role, permissions=None):
    """Prefer explicit permissions; fall back to role defaults when empty/missing."""
    if permissions:
        return list(permissions)
    return list(ROLE_PERMISSIONS.get(role, []))


def role_required(permission):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            user_role = session.get("role")

            if not user_role:
                return jsonify({"error": "Authentication required"}), 401

            session_permissions = effective_permissions(
                user_role,
                session.get("permissions"),
            )
            if permission not in session_permissions and user_role != "admin":
                return jsonify({
                    "error": "Access denied",
                    "message": "You do not have permission to perform this action",
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator


def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if not session.get("role"):
            return jsonify({"error": "Authentication required"}), 401
        return function(*args, **kwargs)

    return wrapper
