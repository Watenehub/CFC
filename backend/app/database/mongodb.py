from pymongo import MongoClient, ASCENDING
from flask import current_app
import os


def init_mongo(app):
    uri = app.config.get("MONGO_URI")

    if not uri:
        raise RuntimeError("MONGO_URI is not configured.")

    client_kwargs = {
        "serverSelectionTimeoutMS": 5000,
        "retryWrites": True,
    }

    client = MongoClient(uri, **client_kwargs)

    db_name = app.config.get(
        "MONGO_DB_NAME",
        "cornerstone_family_chapel"
    )

    db = client[db_name]
    client.admin.command("ping")
    _ensure_indexes(db)

    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = db

    return db


def _ensure_indexes(db):
    db.users.create_index("email")
    db.users.create_index("id", unique=True)
    db.password_resets.create_index("token_hash", unique=True)
    db.password_resets.create_index("expires_at", expireAfterSeconds=0)
    db.security_events.create_index("created_at", expireAfterSeconds=90 * 24 * 60 * 60)
    db.security_events.create_index([("action", ASCENDING), ("created_at", ASCENDING)])


def get_db():
    return current_app.extensions["mongo_db"]
