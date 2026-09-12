from functools import wraps
from flask import jsonify, session


ALL_PERMISSIONS = [
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
]

ROLE_PERMISSIONS = {
    "admin": list(ALL_PERMISSIONS),
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
    "guest": [],
}


def has_permission(role, permission):
    return permission in ROLE_PERMISSIONS.get(role, [])


def effective_permissions(role, permissions=None):
    """Use the permissions assigned by an admin whenever they are provided."""
    if isinstance(permissions, list):
        allowed = set(ALL_PERMISSIONS)
        return [item for item in permissions if item in allowed]
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
            if user_role == "admin" or permission in session_permissions:
                return function(*args, **kwargs)

            return jsonify({
                "error": "Access denied",
                "message": "You do not have permission to perform this action",
            }), 403

        return wrapper

    return decorator


def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if not session.get("role"):
            return jsonify({"error": "Authentication required"}), 401
        return function(*args, **kwargs)

    return wrapper
