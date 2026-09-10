from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
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
}


def seed_database():
    """Initialize MongoDB with default users, or sync permissions for existing defaults."""
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]

    users = [
        {
            "id": 1,
            "name": "System Admin",
            "email": "admin@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "admin",
            "permissions": ROLE_PERMISSIONS["admin"],
        },
        {
            "id": 2,
            "name": "Media Account",
            "email": "media@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "media",
            "permissions": ROLE_PERMISSIONS["media"],
        },
        {
            "id": 3,
            "name": "Secretary Account",
            "email": "secretary@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "secretary",
            "permissions": ROLE_PERMISSIONS["secretary"],
        },
    ]

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

    print("Seed complete. Default password for seeded accounts: admin123")
    client.close()


if __name__ == "__main__":
    seed_database()
