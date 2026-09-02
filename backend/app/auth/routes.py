from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from .permissions import role_required

auth_bp = Blueprint("auth", __name__)

# Temporary development users.
# These will later be stored in MongoDB.
users = [
    {
        "id": 1,
        "name": "System Admin",
        "email": "admin@cornerstonechapel.org",
        "password": generate_password_hash("admin123"),
        "role": "admin",
        "permissions": [
            "manage_users", "manage_events", "manage_sermons", "manage_giving",
            "manage_enquiries", "manage_pastors", "manage_deacons", "manage_ministries",
            "manage_services", "manage_notifications", "manage_gallery"
        ]
    },
    {
        "id": 2,
        "name": "Media Account",
        "email": "media@cornerstonechapel.org",
        "password": generate_password_hash("admin123"),
        "role": "media",
        "permissions": ["manage_events", "manage_sermons", "manage_gallery"]
    },
    {
        "id": 3,
        "name": "Secretary Account",
        "email": "secretary@cornerstonechapel.org",
        "password": generate_password_hash("admin123"),
        "role": "secretary",
        "permissions": ["manage_giving", "manage_enquiries"]
    },
]


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    user = next(
        (user for user in users if user["email"] == email),
        None
    )

    if not user or not check_password_hash(user["password"], password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session["permissions"] = user.get("permissions", [])

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "permissions": user.get("permissions", [])
        }
    })


@auth_bp.route("/api/auth/me", methods=["GET"])
def current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Not authenticated"
        }), 401

    user = next(
        (user for user in users if user["id"] == user_id),
        None
    )

    if not user:
        session.clear()

        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "permissions": user.get("permissions", [])
    })


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
    return jsonify([
        {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
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
    permissions = data.get("permissions", [])

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

    if any(user["email"] == email for user in users):
        return jsonify({
            "error": "Email already exists"
        }), 409

    new_user = {
        "id": len(users) + 1,
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "role": role,
        "permissions": permissions
    }

    users.append(new_user)

    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
            ,"permissions": new_user["permissions"]
        }
    }), 201


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["PUT"])
@role_required("manage_users")
def update_user(user_id):
    user = next((item for item in users if item["id"] == user_id), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    user["name"] = data.get("name", user["name"]).strip()
    user["email"] = data.get("email", user["email"]).strip().lower()
    user["role"] = data.get("role", user["role"]).strip().lower()
    user["permissions"] = data.get("permissions", user.get("permissions", []))
    if data.get("password"):
        user["password"] = generate_password_hash(data["password"])

    return jsonify({"message": "User updated successfully", "user": {key: user[key] for key in ("id", "name", "email", "role", "permissions")}})


@auth_bp.route("/api/auth/users/<int:user_id>", methods=["DELETE"])
@role_required("manage_users")
def delete_user(user_id):
    global users
    user = next((item for item in users if item["id"] == user_id), None)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if user_id == session.get("user_id"):
        return jsonify({"error": "You cannot remove your own account"}), 400
    users = [item for item in users if item["id"] != user_id]
    return jsonify({"message": "User removed successfully"})