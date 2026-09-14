import os
import smtplib
import ssl
from email.message import EmailMessage
from .events import log_security_event


def send_email(to_address, subject, body):
    host = os.getenv("SMTP_HOST", "").strip()
    sender = os.getenv("SMTP_FROM") or os.getenv("SMTP_USER") or "noreply@localhost"
    if not host or not to_address:
        log_security_event(
            "email_skipped",
            outcome="info",
            reason="smtp_unconfigured",
            subject=subject,
        )
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = to_address
    message.set_content(body)

    port = int(os.getenv("SMTP_PORT", "587"))
    username = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_PASSWORD", "")
    use_tls = os.getenv("SMTP_TLS", "true").lower() in {"1", "true", "yes"}

    context = ssl.create_default_context()
    with smtplib.SMTP(host, port, timeout=20) as smtp:
        smtp.ehlo()
        if use_tls:
            smtp.starttls(context=context)
            smtp.ehlo()
        if username:
            smtp.login(username, password)
        smtp.send_message(message)
    return True
