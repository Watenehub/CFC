from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "cornerstone_family_chapel")

def seed_database():
    """Initialize MongoDB with default users."""
    
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    # Check if admin user already exists
    existing_admin = db.users.find_one({"email": "admin@cornerstonechapel.org"})
    
    if existing_admin:
        print("Admin user already exists. Skipping seed.")
        return
    
    # Create default users
    users = [
        {
            "id": 1,
            "name": "System Admin",
            "email": "admin@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "admin",
            "permissions": [
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
                "manage_gallery"
            ]
        },
        {
            "id": 2,
            "name": "Media Account",
            "email": "media@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "media",
            "permissions": [
                "manage_events",
                "manage_sermons",
                "manage_gallery"
            ]
        },
        {
            "id": 3,
            "name": "Secretary Account",
            "email": "secretary@cornerstonechapel.org",
            "password": generate_password_hash("admin123"),
            "role": "secretary",
            "permissions": [
                "manage_giving",
                "manage_enquiries"
            ]
        }
    ]
    
    # Insert users
    db.users.insert_many(users)
    
    print("Database seeded successfully with default users:")
    print("- admin@cornerstonechapel.org (password: admin123)")
    print("- media@cornerstonechapel.org (password: admin123)")
    print("- secretary@cornerstonechapel.org (password: admin123)")
    
    client.close()

if __name__ == "__main__":
    seed_database()
