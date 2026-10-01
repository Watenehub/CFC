from functools import wraps
from flask import current_app, jsonify, session


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
    """Restrict custom permissions to capabilities assigned to the role."""
    if isinstance(permissions, list):
        allowed = set(ROLE_PERMISSIONS.get(role, []))
        return [item for item in permissions if item in allowed]
    return list(ROLE_PERMISSIONS.get(role, []))


def get_session_user():
    user_id = session.get("user_id")
    if user_id is None:
        return None

    user = current_app.extensions["mongo_db"].users.find_one({"id": user_id})
    if (
        not user
        or user.get("role") not in {"admin", "media", "secretary"}
        or user.get("active") is False
        or user.get("status") == "disabled"
        or session.get("role") != user.get("role")
        or session.get("session_version", 0) != user.get("session_version", 0)
    ):
        session.clear()
        return None

    return user


def admin_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        user = get_session_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        if user.get("role") != "admin":
            return jsonify({"error": "Access denied"}), 403
        return function(*args, **kwargs)
    return wrapper


def roles_required(*roles):
    allowed = set(roles)

    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            user = get_session_user()
            if not user:
                return jsonify({"error": "Authentication required"}), 401
            if user.get("role") not in allowed:
                return jsonify({"error": "Access denied"}), 403
            return function(*args, **kwargs)
        return wrapper
    return decorator


def role_required(permission):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            user = get_session_user()
            if not user:
                return jsonify({"error": "Authentication required"}), 401

            user_role = user.get("role")
            session_permissions = effective_permissions(user_role, user.get("permissions"))
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
        if not get_session_user():
            return jsonify({"error": "Authentication required"}), 401
        return function(*args, **kwargs)

    return wrapper
