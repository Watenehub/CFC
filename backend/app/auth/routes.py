from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from .permissions import role_required, effective_permissions, ROLE_PERMISSIONS
from ..database.mongodb import get_db
from pymongo import DESCENDING


auth_bp = Blueprint("auth", __name__)


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
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    db = get_db()

    user = db.users.find_one({
        "email": email
    })

    if not user or not check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

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

    user = db.users.find_one({
        "id": user_id
    })

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
        "secretary"
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

    existing_user = db.users.find_one({
        "email": email
    })

    if existing_user:
        return jsonify({
            "error": "Email already exists in the system. Please use a different email address."
        }), 409

    last_user = db.users.find_one(
        {},
        sort=[("id", DESCENDING)]
    )

    next_id = (
        last_user["id"] + 1
        if last_user
        else 1
    )

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

    user = db.users.find_one({
        "id": user_id
    })

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    data = request.get_json() or {}

    update_data = {}

    if "name" in data:
        update_data["name"] = data["name"].strip()

    if "email" in data:
        update_data["email"] = data["email"].strip().lower()

    if "role" in data:
        role = data["role"].strip().lower()

        if role not in [
            "admin",
            "media",
            "secretary"
        ]:
            return jsonify({
                "error": "Invalid role"
            }), 400

        update_data["role"] = role

    if "permissions" in data:
        update_data["permissions"] = data["permissions"]

    if data.get("password"):
        update_data["password"] = generate_password_hash(
            data["password"]
        )

    if update_data:
        db.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )

    updated_user = db.users.find_one({
        "id": user_id
    })

    return jsonify({
        "message": "User updated successfully",
        "user": serialize_user(updated_user)
    })


@auth_bp.route("/api/auth/change-password", methods=["POST"])
def change_password():
    """Allow users to change their own password with old password verification."""
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    db = get_db()
    data = request.get_json() or {}
    
    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")
    
    if not old_password or not new_password:
        return jsonify({"error": "Old password and new password are required"}), 400
    
    # Get current user
    user = db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Verify old password
    if not check_password_hash(user["password"], old_password):
        return jsonify({"error": "Incorrect old password"}), 400
    
    # Validate new password strength
    if len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
    
    if not any(c.isupper() for c in new_password):
        return jsonify({"error": "Password must contain at least one uppercase letter"}), 400
    
    if not any(c.islower() for c in new_password):
        return jsonify({"error": "Password must contain at least one lowercase letter"}), 400
    
    if not any(c.isdigit() for c in new_password):
        return jsonify({"error": "Password must contain at least one digit"}), 400
    
    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if not any(c in special_chars for c in new_password):
        return jsonify({"error": "Password must contain at least one special character"}), 400
    
    # Update password
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

    result = db.users.delete_one({
        "id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "message": "User removed successfully"
    })