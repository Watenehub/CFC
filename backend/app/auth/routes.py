import hashlib
import hashlib
import re
from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from .permissions import admin_required, get_session_user, role_required, effective_permissions
from ..database.mongodb import get_db
from ..security import audit_event, csrf, limiter
from ..security import pagination_args
from flask_limiter.util import get_remote_address
from pymongo import DESCENDING


auth_bp = Blueprint("auth", __name__)


def valid_password(value):
    return (
        isinstance(value, str)
        and 12 <= len(value) <= 128
        and re.search(r"[a-z]", value)
        and re.search(r"[A-Z]", value)
        and re.search(r"\d", value)
        and re.search(r"[^A-Za-z0-9]", value)
    )


def valid_email(value):
    return isinstance(value, str) and len(value) <= 254 and re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value)


def _login_limit_key():
    email = request.get_json(silent=True) or {}
    normalized = email.get("email", "")
    if not isinstance(normalized, str):
        normalized = ""
    return f"{get_remote_address()}:{_hash_token(normalized.strip().lower())}"


def _login_account_limit_key():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "") if isinstance(data, dict) else ""
    return f"login-account:{_hash_token(email.strip().lower() if isinstance(email, str) else '')}"


def _hash_token(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _active_admin_count(db):
    return db.users.count_documents({
        "role": "admin",
        "active": {"$ne": False},
        "status": {"$ne": "disabled"},
    })


def serialize_user(user):
    """Return a user without the password or MongoDB internal ID."""
    role = user["role"]
    permissions = effective_permissions(role, user.get("permissions"))
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": role,
        "permissions": permissions,
    }


@auth_bp.route("/api/auth/login", methods=["POST"])
@limiter.limit("5 per minute", key_func=_login_limit_key)
@limiter.limit("20 per hour", key_func=_login_account_limit_key)
def login():
    data = request.get_json() or {}

    raw_email = data.get("email", "")
    email = raw_email.strip().lower() if isinstance(raw_email, str) else ""
    password = data.get("password", "")

    if not email or not isinstance(password, str) or not password or len(password) > 256:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    password_matches = False
    if user and isinstance(user.get("password"), str):
        try:
            password_matches = check_password_hash(user["password"], password)
        except (ValueError, TypeError):
            password_matches = False
    if (
        not user
        or user.get("role") not in {"admin", "media", "secretary"}
        or user.get("active") is False
        or user.get("status") == "disabled"
        or not password_matches
    ):
        audit_event("login_failed", success=False)
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    session.clear()
    session.permanent = True
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session["permissions"] = effective_permissions(user["role"], user.get("permissions"))
    session["session_version"] = user.get("session_version", 0)
    audit_event("login_succeeded", target_id=user["id"])

    return jsonify({
        "message": "Login successful",
        "user": serialize_user(user)
    })


@auth_bp.route("/api/auth/me", methods=["GET"])
def current_user():
    user = get_session_user()
    if not user:
        return jsonify({
            "error": "Authentication required"
        }), 401

    return jsonify(serialize_user(user))


@auth_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    if session.get("user_id"):
        audit_event("logout", target_id=session.get("user_id"))
    session.clear()
    return jsonify({
        "message": "Logout successful"
    })


@auth_bp.route("/api/auth/register", methods=["POST"])
@csrf.exempt
def register():
    return jsonify({"error": "Not found"}), 404


@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
@csrf.exempt
def forgot_password():
    return jsonify({"error": "Not found"}), 404


@auth_bp.route("/api/auth/reset-password", methods=["POST"])
@csrf.exempt
def reset_password():
    return jsonify({"error": "Not found"}), 404


@auth_bp.route("/api/auth/users", methods=["GET"])
@admin_required
def get_users():
    db = get_db()
    page, page_size = pagination_args(request.args, default_size=50)
    users = db.users.find().sort("id", 1).skip((page - 1) * page_size).limit(page_size)
    return jsonify([
        serialize_user(user)
        for user in users
    ])


@auth_bp.route("/api/auth/users", methods=["POST"])
@admin_required
def create_user():
    data = request.get_json() or {}

    name_value = data.get("name", "")
    email_value = data.get("email", "")
    name = name_value.strip() if isinstance(name_value, str) else ""
    email = email_value.strip().lower() if isinstance(email_value, str) else ""
    password = data.get("password", "")
    role = data.get("role", "").strip().lower()
    permissions = effective_permissions(role, data.get("permissions"))

    allowed_roles = ["admin", "media", "secretary"]

    if not name or len(name) > 160 or not valid_email(email) or not password or not role:
        return jsonify({
            "error": "Name, email, password and role are required"
        }), 400

    if role not in allowed_roles:
        return jsonify({
            "error": "Invalid role",
            "allowed_roles": allowed_roles
        }), 400

    if not valid_password(password):
        return jsonify({"error": "Password must be 12-128 characters and include upper/lowercase letters, a number, and a symbol."}), 400

    db = get_db()
    existing_user = db.users.find_one({"email": email})

    if existing_user:
        return jsonify({
            "error": "An account with this email already exists. Open that user from the list to update their details.",
            "existing_user": serialize_user(existing_user),
        }), 409

    last_user = db.users.find_one({}, sort=[("id", DESCENDING)])
    next_id = last_user["id"] + 1 if last_user else 1

    new_user = {
        "id": next_id,
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "role": role,
        "permissions": permissions
    }

    db.users.insert_one(new_user)
    audit_event("staff_created", target_id=next_id)

    return jsonify({
        "message": "User created successfully",
        "user": serialize_user(new_user)
    }), 201


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    db = get_db()
    user = db.users.find_one({"id": user_id})

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    data = request.get_json() or {}
    update_data = {}

    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"].strip() or len(data["name"]) > 160:
            return jsonify({"error": "Invalid name"}), 400
        update_data["name"] = data["name"].strip()

    if "email" in data:
        if not valid_email(data["email"]):
            return jsonify({"error": "Invalid email"}), 400
        email = data["email"].strip().lower()
        other = db.users.find_one({"email": email, "id": {"$ne": user_id}})
        if other:
            return jsonify({
                "error": "An account with this email already exists. Use a different email address.",
                "existing_user": serialize_user(other),
            }), 409
        update_data["email"] = email

    if "role" in data:
        if not isinstance(data["role"], str):
            return jsonify({"error": "Invalid role"}), 400
        role = data["role"].strip().lower()
        if role not in ["admin", "media", "secretary"]:
            return jsonify({
                "error": "Invalid role"
            }), 400
        if user.get("role") == "admin" and role != "admin" and _active_admin_count(db) <= 1:
            return jsonify({"error": "The last active administrator cannot be demoted"}), 409
        update_data["role"] = role
        update_data["session_version"] = user.get("session_version", 0) + 1

    if "permissions" in data:
        if not isinstance(data["permissions"], list):
            return jsonify({"error": "Permissions must be a list"}), 400
        update_data["permissions"] = effective_permissions(
            update_data.get("role", user.get("role")),
            data.get("permissions"),
        )

    if "password" in data:
        if not valid_password(data["password"]):
            return jsonify({"error": "Password must be 12-128 characters and include upper/lowercase letters, a number, and a symbol."}), 400
        update_data["password"] = generate_password_hash(data["password"])
        update_data["session_version"] = user.get("session_version", 0) + 1

    if "active" in data:
        if not isinstance(data["active"], bool):
            return jsonify({"error": "active must be a boolean"}), 400
        if user.get("role") == "admin" and not data["active"] and _active_admin_count(db) <= 1:
            return jsonify({"error": "The last active administrator cannot be disabled"}), 409
        update_data["active"] = data["active"]
        update_data["session_version"] = user.get("session_version", 0) + 1
    if data.get("status") == "disabled":
        update_data["active"] = False
        update_data["session_version"] = user.get("session_version", 0) + 1

    if update_data:
        db.users.update_one({"id": user_id}, {"$set": update_data})
        audit_event("staff_updated", target_id=user_id)

        if session.get("user_id") == user_id:
            session.clear()

    updated_user = db.users.find_one({"id": user_id})
    return jsonify({
        "message": "User updated successfully",
        "user": serialize_user(updated_user)
    })


@auth_bp.route("/api/auth/change-password", methods=["POST"])
@admin_required
def change_password():
    data = request.get_json() or {}
    current_password = data.get("old_password", "")
    new_password = data.get("new_password", "")
    admin = get_session_user()

    if not isinstance(current_password, str) or not isinstance(new_password, str):
        return jsonify({"error": "Invalid password values"}), 400
    if not check_password_hash(admin.get("password", ""), current_password):
        return jsonify({"error": "Current password is incorrect"}), 400
    if not valid_password(new_password):
        return jsonify({"error": "Password must be 12-128 characters and include upper/lowercase letters, a number, and a symbol."}), 400

    db = get_db()
    db.users.update_one(
        {"id": admin["id"]},
        {"$set": {
            "password": generate_password_hash(new_password),
            "session_version": admin.get("session_version", 0) + 1,
        }},
    )
    audit_event("admin_password_changed", target_id=admin["id"])
    session.clear()
    return jsonify({"message": "Password changed. Please sign in again."})


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    db = get_db()

    if user_id == session.get("user_id"):
        return jsonify({
            "error": "You cannot remove your own account"
        }), 400

    target = db.users.find_one({"id": user_id})
    if target and target.get("role") == "admin" and _active_admin_count(db) <= 1:
        return jsonify({"error": "The last active administrator cannot be deleted"}), 409

    result = db.users.delete_one({"id": user_id})

    if result.deleted_count == 0:
        return jsonify({
            "error": "User not found"
        }), 404

    audit_event("staff_deleted", target_id=user_id)

    return jsonify({
        "message": "User removed successfully"
    })
