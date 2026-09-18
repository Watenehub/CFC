import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from .permissions import role_required, effective_permissions
from ..database.mongodb import get_db
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
    update_data["password"] = generate_password_hash(password)
    return None


@auth_bp.route("/api/auth/login", methods=["POST"])
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

    if not user or not check_password_hash(user["password"], password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    session.clear()
    session.permanent = True
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session["permissions"] = effective_permissions(user["role"], user.get("permissions"))

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
    session.clear()
    return jsonify({
        "message": "Logout successful"
    })


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    return jsonify({
        "error": "Public registration is disabled. Ask an administrator to create a staff account."
    }), 403


@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
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
        send_email(user["email"], "Reset your CFC staff password", body)
    except Exception:
        pass

    return jsonify(generic)


@auth_bp.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")

    if not token:
        return jsonify({"error": "A valid reset token is required"}), 400

    db = get_db()
    record = db.password_resets.find_one({"token_hash": _hash_token(token), "used": False})
    expires = record.get("expires_at") if record else None
    if expires and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)

    if not record or (expires and expires < datetime.now(timezone.utc)):
        return jsonify({"error": "This reset link is invalid or has expired."}), 400

    db.users.update_one(
        {"id": record["user_id"]},
        {"$set": {"password": generate_password_hash(new_password), "failed_login_attempts": 0},
         "$unset": {"lock_until": ""}},
    )
    db.password_resets.update_one({"_id": record["_id"]}, {"$set": {"used": True}})
    db.password_resets.delete_many({"user_id": record["user_id"], "used": False})
    return jsonify({"message": "Password updated. You can sign in with your new password."})


@auth_bp.route("/api/auth/users", methods=["GET"])
@role_required("manage_users")
def get_users():
    db = get_db()
    users = db.users.find().sort("id", 1)
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
        _apply_password(update_data, data["password"])

    if update_data:
        db.users.update_one({"id": user_id}, {"$set": update_data})

        if session.get("user_id") == user_id:
            if "role" in update_data:
                session["role"] = update_data["role"]
            if "permissions" in update_data:
                session["permissions"] = update_data["permissions"]

    updated_user = db.users.find_one({"id": user_id})
    return jsonify({
        "message": "User updated successfully",
        "user": serialize_user(updated_user)
    })


@auth_bp.route("/api/auth/change-password", methods=["POST"])
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
        return jsonify({"error": "Incorrect old password"}), 400

    db.users.update_one(
        {"id": user_id},
        {"$set": {"password": generate_password_hash(new_password)}}
    )
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

    return jsonify({
        "message": "User removed successfully"
    })
