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
    IS_PRODUCTION = (
        os.getenv("APP_ENV", "").lower() == "production"
        or os.getenv("FLASK_ENV", "").lower() == "production"
        or os.getenv("RENDER", "").lower() == "true"
        or bool(os.getenv("RENDER_SERVICE_ID"))
    )
    SESSION_COOKIE_SECURE = IS_PRODUCTION
    SESSION_COOKIE_SAMESITE = os.getenv(
        "SESSION_COOKIE_SAMESITE",
        "None" if IS_PRODUCTION else "Lax",
    )
    PERMANENT_SESSION_LIFETIME = timedelta(
        hours=int(os.getenv("SESSION_HOURS", "8"))
    )
    SESSION_REFRESH_EACH_REQUEST = True
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = int(os.getenv("CSRF_TIME_LIMIT", str(8 * 3600)))
    WTF_CSRF_HEADERS = ["X-CSRFToken", "X-CSRF-Token"]
    WTF_CSRF_SSL_STRICT = False
    WTF_CSRF_CHECK_DEFAULT = True
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_HEADERS_ENABLED = True
    MAX_IMAGE_PIXELS = int(os.getenv("MAX_IMAGE_PIXELS", "40000000"))
    MAX_IMAGE_SIDE = int(os.getenv("MAX_IMAGE_SIDE", "12000"))
    MPESA_CALLBACK_TOKEN = os.getenv("MPESA_CALLBACK_TOKEN")

    if IS_PRODUCTION:
        CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "https://cfckenya.vercel.app").split(",") if origin.strip()]
    else:
        CORS_ORIGINS = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "https://cfckenya.vercel.app,http://localhost:3000,http://localhost:5173",
            ).split(",")
            if origin.strip()
        ]
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "300 per minute")
