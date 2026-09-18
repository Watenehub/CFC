import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def _bool_env(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes"}


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv(
        "MONGO_DB_NAME",
        "cornerstone_family_chapel"
    )
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    SESSION_COOKIE_NAME = "cfc_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Temporarily disabled for debugging
    SESSION_COOKIE_SAMESITE = os.getenv(
        "SESSION_COOKIE_SAMESITE",
        "Lax",  # Use Lax for better compatibility with CORS
    )
    PERMANENT_SESSION_LIFETIME = timedelta(
        hours=int(os.getenv("SESSION_HOURS", "8"))
    )
    SESSION_REFRESH_EACH_REQUEST = True
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = int(os.getenv("CSRF_TIME_LIMIT", str(8 * 3600)))
    WTF_CSRF_HEADERS = ["X-CSRFToken", "X-CSRF-Token"]
    WTF_CSRF_SSL_STRICT = os.getenv("FLASK_ENV") == "production"
    WTF_CSRF_CHECK_DEFAULT = True
