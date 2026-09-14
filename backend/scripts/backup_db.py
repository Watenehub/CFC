"""Dump MongoDB collections to a timestamped JSON backup.

Enable Atlas automated backups in production as well:
https://www.mongodb.com/docs/atlas/backup/cloud-backup/overview/
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

SKIP_COLLECTIONS = set()


def _json_default(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def main():
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise SystemExit("MONGO_URI is not configured.")

    db_name = os.getenv("MONGO_DB_NAME", "cornerstone_family_chapel")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out_dir = Path(__file__).resolve().parent.parent / "backups"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{db_name}-{stamp}.json"

    payload = {}
    for name in db.list_collection_names():
        if name.startswith("system.") or name in SKIP_COLLECTIONS:
            continue
        documents = []
        for document in db[name].find():
            document.pop("_id", None)
            documents.append(document)
        payload[name] = documents

    out_path.write_text(json.dumps(payload, default=_json_default, indent=2), encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
