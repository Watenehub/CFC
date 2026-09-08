from pymongo import MongoClient
from flask import current_app


def init_mongo(app):
    uri = app.config.get("MONGO_URI")

    if not uri:
        raise RuntimeError("MONGO_URI is not configured.")

    client = MongoClient(
        uri,
        serverSelectionTimeoutMS=5000,
        tlsAllowInvalidCertificates=True
    )

    db_name = app.config.get(
        "MONGO_DB_NAME",
        "cornerstone_family_chapel"
    )

    db = client[db_name]

    # Verify the connection
    client.admin.command("ping")

    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = db

    return db


def get_db():
    return current_app.extensions["mongo_db"]