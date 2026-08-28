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
        "manage_notifications"
    ],

    "media": [
        "manage_events",
        "manage_sermons"
    ],

    "secretary": [
        "manage_giving",
        "manage_enquiries"
    ]
}


def has_permission(role, permission):
    return permission in ROLE_PERMISSIONS.get(role, [])


def role_required(permission):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):

            user_role = session.get("role")

            if not user_role:
                return jsonify({
                    "error": "Authentication required"
                }), 401

            if not has_permission(user_role, permission):
                return jsonify({
                    "error": "Access denied",
                    "message": "You do not have permission to perform this action"
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator