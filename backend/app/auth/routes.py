import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from .permissions import role_required, effective_permissions
from ..database.mongodb import get_db
# from ..security.events import log_security_event
# from ..security.lockout import (
#     clear_failed_logins,
#     lockout_status,
#     register_failed_login,
# )
# from ..security.mailer import send_email
# from ..security.passwords import PASSWORD_HELP, validate_password
# from ..security.rate_limit import limiter
from pymongo import DESCENDING


auth_bp = Blueprint("auth", __name__)
RESET_HOURS = 1


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


def _hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _apply_password(update_data, password):
    # error = validate_password(password)
    # if error:
    #     return error
    update_data["password"] = generate_password_hash(password)
    return None


@auth_bp.route("/api/auth/login", methods=["POST"])
# @limiter.limit("5 per minute; 20 per hour")
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    db = get_db()
    user = db.users.find_one({"email": email})
    # locked = lockout_status(user)
    # if locked:
    #     log_security_event("login_blocked", email=email, user_id=user.get("id"))
    #     return jsonify({"error": locked}), 429

    if not user or not check_password_hash(user["password"], password):
        # register_failed_login(db, user, email)
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    # clear_failed_logins(db, user)
    session.clear()
    session.permanent = True
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session["permissions"] = effective_permissions(user["role"], user.get("permissions"))

    # log_security_event("login_success", outcome="success", email=email, user_id=user["id"])

    return jsonify({
        "message": "Login successful",
        "user": serialize_user(user)
    })


@auth_bp.route("/api/auth/me", methods=["GET"])
def current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Not authenticated"
        }), 401

    db = get_db()
    user = db.users.find_one({"id": user_id})

    if not user:
        session.clear()
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify(serialize_user(user))


@auth_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    # log_security_event("logout", outcome="success", user_id=session.get("user_id"))
    session.clear()
    return jsonify({
        "message": "Logout successful"
    })


@auth_bp.route("/api/auth/register", methods=["POST"])
# @limiter.limit("3 per hour")
def register():
    # log_security_event("register_blocked", reason="public_registration_disabled")
    return jsonify({
        "error": "Public registration is disabled. Ask an administrator to create a staff account."
    }), 403


@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
# @limiter.limit("3 per minute; 10 per hour")
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    generic = {
        "message": "If that email is registered, a password reset link has been sent."
    }
    if not email:
        return jsonify(generic)

    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        # log_security_event("password_reset_requested", email=email, reason="unknown_user")
        return jsonify(generic)

    raw_token = secrets.token_urlsafe(32)
    db.password_resets.delete_many({"user_id": user["id"]})
    db.password_resets.insert_one({
        "token_hash": _hash_token(raw_token),
        "user_id": user["id"],
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=RESET_HOURS),
        "used": False,
    })

    frontend = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    reset_url = f"{frontend}/reset-password?token={raw_token}"
    body = (
        "You requested a password reset for your Cornerstone Family Chapel staff account.\n\n"
        f"Open this link within {RESET_HOURS} hour(s):\n{reset_url}\n\n"
        "If you did not request this, you can ignore this email."
    )
    try:
        # send_email(user["email"], "Reset your CFC staff password", body)
        pass
    except Exception:
        # log_security_event("password_reset_email_failed", email=email, user_id=user["id"])
        pass

    # log_security_event("password_reset_requested", outcome="success", email=email, user_id=user["id"])
    return jsonify(generic)


@auth_bp.route("/api/auth/reset-password", methods=["POST"])
# @limiter.limit("5 per minute")
def reset_password():
    data = request.get_json() or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")

    # error = validate_password(new_password)
    # if not token or error:
    #     return jsonify({"error": error or "A valid reset token is required"}), 400
    if not token:
        return jsonify({"error": "A valid reset token is required"}), 400

    db = get_db()
    record = db.password_resets.find_one({"token_hash": _hash_token(token), "used": False})
    expires = record.get("expires_at") if record else None
    if expires and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)

    if not record or (expires and expires < datetime.now(timezone.utc)):
        # log_security_event("password_reset_failed", reason="invalid_or_expired_token")
        return jsonify({"error": "This reset link is invalid or has expired."}), 400

    db.users.update_one(
        {"id": record["user_id"]},
        {"$set": {"password": generate_password_hash(new_password), "failed_login_attempts": 0},
         "$unset": {"lock_until": ""}},
    )
    db.password_resets.update_one({"_id": record["_id"]}, {"$set": {"used": True}})
    db.password_resets.delete_many({"user_id": record["user_id"], "used": False})
    # log_security_event("password_reset_success", outcome="success", user_id=record["user_id"])
    return jsonify({"message": "Password updated. You can sign in with your new password."})


@auth_bp.route("/api/auth/users", methods=["GET"])
@role_required("manage_users")
def get_users():
    db = get_db()
    users = db.users.find().sort("id", 1)
    # log_security_event("users_listed", outcome="success")
    return jsonify([
        serialize_user(user)
        for user in users
    ])


@auth_bp.route("/api/auth/users", methods=["POST"])
@role_required("manage_users")
def create_user():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "").strip().lower()
    permissions = effective_permissions(role, data.get("permissions"))

    allowed_roles = [
        "admin",
        "media",
        "secretary",
        "guest",
    ]

    if not name or not email or not password or not role:
        return jsonify({
            "error": "Name, email, password and role are required"
        }), 400

    # password_error = validate_password(password)
    # if password_error:
    #     return jsonify({"error": password_error, "hint": PASSWORD_HELP}), 400

    if role not in allowed_roles:
        return jsonify({
            "error": "Invalid role",
            "allowed_roles": allowed_roles
        }), 400

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
    # log_security_event(
    #     "user_created",
    #     outcome="success",
    #     target_user_id=next_id,
    #     target_email=email,
    #     target_role=role,
    # )

    return jsonify({
        "message": "User created successfully",
        "user": serialize_user(new_user)
    }), 201


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["PUT"])
@role_required("manage_users")
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
        update_data["name"] = data["name"].strip()

    if "email" in data:
        email = data["email"].strip().lower()
        other = db.users.find_one({"email": email, "id": {"$ne": user_id}})
        if other:
            return jsonify({
                "error": "An account with this email already exists. Use a different email address.",
                "existing_user": serialize_user(other),
            }), 409
        update_data["email"] = email

    if "role" in data:
        role = data["role"].strip().lower()
        if role not in ["admin", "media", "secretary", "guest"]:
            return jsonify({
                "error": "Invalid role"
            }), 400
        update_data["role"] = role

    if "permissions" in data:
        update_data["permissions"] = effective_permissions(
            update_data.get("role", user.get("role")),
            data.get("permissions"),
        )

    if data.get("password"):
        password_error = _apply_password(update_data, data["password"])
        if password_error:
            return jsonify({"error": password_error}), 400

    if update_data:
        db.users.update_one({"id": user_id}, {"$set": update_data})

        if session.get("user_id") == user_id:
            if "role" in update_data:
                session["role"] = update_data["role"]
            if "permissions" in update_data:
                session["permissions"] = update_data["permissions"]

    # log_security_event(
    #     "user_updated",
    #     outcome="success",
    #     target_user_id=user_id,
    #     fields=sorted(update_data.keys()),
    # )

    updated_user = db.users.find_one({"id": user_id})
    return jsonify({
        "message": "User updated successfully",
        "user": serialize_user(updated_user)
    })


@auth_bp.route("/api/auth/change-password", methods=["POST"])
# @limiter.limit("5 per minute")
def change_password():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    db = get_db()
    data = request.get_json() or {}
    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")

    if not old_password or not new_password:
        return jsonify({"error": "Old password and new password are required"}), 400

    user = db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user["password"], old_password):
        # log_security_event("change_password_failed", user_id=user_id, reason="wrong_old_password")
        return jsonify({"error": "Incorrect old password"}), 400

    # password_error = validate_password(new_password)
    # if password_error:
    #     return jsonify({"error": password_error, "hint": PASSWORD_HELP}), 400

    db.users.update_one(
        {"id": user_id},
        {"$set": {"password": generate_password_hash(new_password)}}
    )
    # log_security_event("change_password_success", outcome="success", user_id=user_id)
    return jsonify({"message": "Password changed successfully"})


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["DELETE"])
@role_required("manage_users")
def delete_user(user_id):
    db = get_db()

    if user_id == session.get("user_id"):
        return jsonify({
            "error": "You cannot remove your own account"
        }), 400

    result = db.users.delete_one({"id": user_id})

    if result.deleted_count == 0:
        return jsonify({
            "error": "User not found"
        }), 404

    # log_security_event("user_deleted", outcome="success", target_user_id=user_id)
    return jsonify({
        "message": "User removed successfully"
    })
