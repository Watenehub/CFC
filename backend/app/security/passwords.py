import re

SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

PASSWORD_HELP = (
    "Password must be at least 8 characters and include uppercase, "
    "lowercase, a number, and a special character."
)


def validate_password(password):
    if not password or len(password) < 8:
        return "Password must be at least 8 characters long"
    if len(password) > 128:
        return "Password is too long"
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return "Password must contain at least one digit"
    if not any(char in SPECIAL_CHARS for char in password):
        return "Password must contain at least one special character"
    return None
