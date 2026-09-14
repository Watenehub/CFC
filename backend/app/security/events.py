import logging
from datetime import datetime, timezone
from flask import has_request_context, request, session

logger = logging.getLogger("cfc.security")


def _ip():
    if not has_request_context():
        return None
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.remote_addr


def log_security_event(action, outcome="failure", **extra):
    record = {
        "created_at": datetime.now(timezone.utc),
        "action": action,
        "outcome": outcome,
        "ip": _ip(),
        "path": request.path if has_request_context() else None,
        "method": request.method if has_request_context() else None,
        "user_id": session.get("user_id") if has_request_context() else None,
        "role": session.get("role") if has_request_context() else None,
    }
    for key, value in extra.items():
        if value is not None and key not in record:
            record[key] = value

    logger.info(
        "security_event action=%s outcome=%s ip=%s path=%s user_id=%s",
        action,
        outcome,
        record.get("ip"),
        record.get("path"),
        record.get("user_id"),
    )

    try:
        from ..database.mongodb import get_db
        get_db().security_events.insert_one(record)
    except Exception:
        logger.exception("Failed to persist security event")
