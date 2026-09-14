from datetime import datetime, timedelta, timezone
from .events import log_security_event

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def _now():
    return datetime.now(timezone.utc)


def _as_utc(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
    return None


def lockout_status(user):
    if not user:
        return None
    until = _as_utc(user.get("lock_until"))
    if until and until > _now():
        remaining = int((until - _now()).total_seconds() // 60) + 1
        return f"Account temporarily locked. Try again in about {remaining} minute(s)."
    return None


def register_failed_login(db, user, email):
    if not user:
        log_security_event("login_failed", email=email, reason="unknown_user")
        return
    attempts = int(user.get("failed_login_attempts") or 0) + 1
    update = {"failed_login_attempts": attempts, "last_failed_login_at": _now()}
    if attempts >= MAX_FAILED_ATTEMPTS:
        update["lock_until"] = _now() + timedelta(minutes=LOCKOUT_MINUTES)
        log_security_event(
            "account_locked",
            email=email,
            user_id=user.get("id"),
            attempts=attempts,
        )
    else:
        log_security_event(
            "login_failed",
            email=email,
            user_id=user.get("id"),
            attempts=attempts,
        )
    db.users.update_one({"id": user["id"]}, {"$set": update})


def clear_failed_logins(db, user):
    db.users.update_one(
        {"id": user["id"]},
        {"$unset": {"lock_until": "", "last_failed_login_at": ""}, "$set": {"failed_login_attempts": 0}},
    )
