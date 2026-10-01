import uuid
from datetime import datetime, timezone
from urllib.parse import urlsplit
from flask import current_app, g, request, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect


csrf = CSRFProtect()
limiter = Limiter(key_func=get_remote_address, default_limits=["300 per minute"])


def pagination_args(args, *, default_size=50, maximum_size=100):
    try:
        page = max(1, int(args.get("page", 1)))
        page_size = min(maximum_size, max(1, int(args.get("page_size", default_size))))
    except (TypeError, ValueError):
        page, page_size = 1, default_size
    return page, page_size


def safe_web_url(value, *, allow_relative=True):
    if not isinstance(value, str) or len(value) > 2048:
        return ""
    value = value.strip()
    if not value or any(ord(char) < 32 for char in value):
        return ""
    if allow_relative and value.startswith("/") and not value.startswith("//") and "\\" not in value:
        return value
    try:
        parsed = urlsplit(value)
        valid_https = parsed.scheme == "https" and parsed.hostname
        valid_local_http = (
            parsed.scheme == "http"
            and parsed.hostname in {"localhost", "127.0.0.1"}
            and not current_app.config.get("IS_PRODUCTION", False)
        )
        if (valid_https or valid_local_http) and not parsed.username and not parsed.password:
            return value
    except ValueError:
        pass
    return ""


def audit_event(action, *, target_id=None, success=True):
    try:
        current_app.extensions["mongo_db"].security_events.insert_one({
            "actor_id": session.get("user_id"),
            "actor_role": session.get("role"),
            "action": action,
            "target_id": target_id,
            "success": bool(success),
            "created_at": datetime.now(timezone.utc),
            "request_id": getattr(g, "request_id", uuid.uuid4().hex),
            "ip": request.remote_addr,
            "user_agent": request.user_agent.string[:300],
        })
        g.security_audit_recorded = True
    except Exception:
        current_app.logger.exception("Security audit event could not be stored")