from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os
import re
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "cornerstone_family_chapel")

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
    "guest": [],
}


def seed_database():
    """Initialize MongoDB with default users, or sync permissions for existing defaults."""
    if not MONGO_URI:
        raise RuntimeError("MONGO_URI must be explicitly configured before seeding.")
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]

    admin_email = os.getenv("INITIAL_ADMIN_EMAIL", "admin@cornerstonechapel.org").strip().lower()
    admin_password = os.getenv("INITIAL_ADMIN_PASSWORD", "")
    if (
        not admin_email
        or len(admin_password) < 12
        or len(admin_password) > 128
        or not re.search(r"[a-z]", admin_password)
        or not re.search(r"[A-Z]", admin_password)
        or not re.search(r"\d", admin_password)
        or not re.search(r"[^A-Za-z0-9]", admin_password)
    ):
        raise RuntimeError("Set INITIAL_ADMIN_EMAIL and a strong INITIAL_ADMIN_PASSWORD before bootstrapping.")

    existing = db.users.find_one({"email": admin_email})
    if existing and existing.get("role") != "admin":
        raise RuntimeError("INITIAL_ADMIN_EMAIL already exists without the admin role; resolve it manually.")

    last_user = db.users.find_one({}, sort=[("id", -1)])
    users = [{
        "id": existing.get("id") if existing else (last_user["id"] + 1 if last_user else 1),
        "name": "System Admin",
        "email": admin_email,
        "password": generate_password_hash(admin_password),
        "role": "admin",
        "permissions": ROLE_PERMISSIONS["admin"],
        "session_version": 0,
        "active": True,
    }]

    for user in users:
        existing = db.users.find_one({"email": user["email"]})
        if existing:
            db.users.update_one(
                {"email": user["email"]},
                {"$set": {"permissions": user["permissions"], "role": user["role"]}},
            )
            print(f"Updated permissions for {user['email']}")
        else:
            db.users.insert_one(user)
            print(f"Created {user['email']}")

    print("Seed complete. Create additional staff accounts from the protected admin console.")
    client.close()


if __name__ == "__main__":
    seed_database()
