import io
import re
import unittest
from unittest.mock import patch

from PIL import Image

from app import create_app


class FakeCollection:
    def __init__(self, documents=None):
        self.documents = list(documents or [])

    def find_one(self, query=None, **_kwargs):
        query = query or {}
        return next((item.copy() for item in self.documents if all(item.get(k) == v for k, v in query.items())), None)

    def find(self, query=None, *_args, **_kwargs):
        query = query or {}
        matches = [item.copy() for item in self.documents if all(item.get(k) == v for k, v in query.items())]
        return FakeCursor(matches)

    def count_documents(self, query=None):
        query = query or {}
        return sum(
            1
            for item in self.documents
            if all(
                (value.get("$ne") != item.get(key)) if isinstance(value, dict) and "$ne" in value else item.get(key) == value
                for key, value in query.items()
            )
        )

    def update_one(self, query, update, upsert=False):
        item = next((item for item in self.documents if all(item.get(k) == v for k, v in query.items())), None)
        if item is None and upsert:
            item = dict(query)
            self.documents.append(item)
        if item is not None:
            item.update(update.get("$set", {}))
        return type("Result", (), {"matched_count": int(item is not None)})()

    def insert_one(self, item):
        self.documents.append(dict(item))


class FakeCursor(list):
    def sort(self, *_args, **_kwargs):
        return self

    def limit(self, count):
        return FakeCursor(self[:count])

    def skip(self, count):
        return FakeCursor(self[count:])


class FakeDatabase:
    def __init__(self):
        self.users = FakeCollection([
            {"id": 1, "name": "Admin", "email": "admin@example.test", "role": "admin", "password": "unused", "permissions": [], "session_version": 0},
            {"id": 2, "name": "Media", "email": "media@example.test", "role": "media", "password": "unused", "permissions": ["manage_users"], "session_version": 0},
        ])
        self.settings = FakeCollection([{"id": "site", "church_name": "Original"}])
        self.security_events = FakeCollection()
        self.notifications = FakeCollection([
            {"id": 1, "title": "Public", "message": "Visible", "active": True},
            {"id": 2, "title": "Internal", "message": "Private", "active": False},
        ])
        self.mpesa_transactions = FakeCollection()
        self.prayer_requests = FakeCollection()


class SecurityRegressionTests(unittest.TestCase):
    def setUp(self):
        self.db = FakeDatabase()
        self.app = create_app({
            "TESTING": True,
            "SECRET_KEY": "test-secret-key-that-is-long-enough-for-tests",
            "TEST_MONGO_DB": self.db,
            "CORS_ORIGINS": ["http://localhost", "https://cfckenya.vercel.app"],
            "WTF_CSRF_ENABLED": True,
        })
        self.client = self.app.test_client()

    def csrf_token(self, *, user_id=None, role=None):
        if user_id is not None:
            with self.client.session_transaction() as session:
                user = self.db.users.find_one({"id": user_id})
                session["user_id"] = user_id
                session["role"] = role
                session["session_version"] = user.get("session_version", 0)
        response = self.client.get("/api/csrf-token")
        return response.get_json()["csrf_token"]

    def test_anonymous_upload_is_rejected(self):
        response = self.client.post("/api/upload", data={"file": (io.BytesIO(b"not-image"), "test.jpg")})
        self.assertEqual(response.status_code, 401)

    def test_all_mutating_api_routes_deny_anonymous_requests(self):
        tested = 0
        exempt_disabled = {
            "/api/auth/register",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/mpesa/callback",
        }
        for rule in self.app.url_map.iter_rules():
            if not rule.rule.startswith("/api/"):
                continue
            for method in sorted((rule.methods or set()) & {"POST", "PUT", "PATCH", "DELETE"}):
                path = re.sub(r"<int:[^>]+>", "1", rule.rule)
                path = re.sub(r"<[^>]+>", "test-id", path)
                response = self.client.open(path, method=method, json={})
                expected = 404 if path in exempt_disabled else 401
                self.assertEqual(response.status_code, expected, f"{method} {path}")
                tested += 1
        self.assertGreaterEqual(tested, 30)

    def test_anonymous_settings_write_is_rejected(self):
        response = self.client.put("/api/settings", json={"church_name": "Changed"})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(self.db.settings.find_one({"id": "site"})["church_name"], "Original")

    def test_anonymous_livestream_write_is_rejected(self):
        response = self.client.put("/api/settings/livestream", json={"is_live": True})
        self.assertEqual(response.status_code, 401)
        self.assertFalse(self.db.settings.find_one({"id": "site"}).get("is_live", False))

    def test_anonymous_staff_write_is_rejected(self):
        response = self.client.put("/api/auth/users/2", json={"role": "admin"})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(self.db.users.find_one({"id": 2})["role"], "media")

    def test_public_prayer_submission_works_with_real_csrf_token(self):
        token = self.csrf_token()
        response = self.client.post(
            "/api/prayer",
            json={"prayerRequest": "Please pray for our family."},
            headers={"X-CSRFToken": token},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.prayer_requests.documents[0]["request"], "Please pray for our family.")

    def test_login_is_rate_limited(self):
        token = self.csrf_token()
        responses = [
            self.client.post(
                "/api/auth/login",
                json={"email": "throttle@example.test", "password": "incorrect"},
                headers={"X-CSRFToken": token},
            )
            for _ in range(6)
        ]
        self.assertEqual(responses[-1].status_code, 429)

    def test_login_rejects_legacy_unsupported_roles_and_bad_hashes_generically(self):
        self.db.users.documents.extend([
            {"id": 3, "email": "guest@example.test", "role": "guest", "password": "hash"},
            {"id": 4, "email": "broken@example.test", "role": "admin", "password": "not-a-valid-hash"},
        ])
        token = self.csrf_token()
        for email in ("guest@example.test", "broken@example.test"):
            response = self.client.post(
                "/api/auth/login",
                json={"email": email, "password": "Something9!"},
                headers={"X-CSRFToken": token},
            )
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.get_json()["error"], "Invalid email or password")

    def test_media_cannot_write_settings_or_users_even_if_db_permissions_are_broad(self):
        token = self.csrf_token(user_id=2, role="media")
        settings_response = self.client.put(
            "/api/settings", json={"church_name": "Changed"}, headers={"X-CSRFToken": token}
        )
        user_response = self.client.put(
            "/api/auth/users/2", json={"role": "admin"}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(settings_response.status_code, 403)
        self.assertEqual(user_response.status_code, 403)
        self.assertEqual(self.db.settings.find_one({"id": "site"})["church_name"], "Original")
        self.assertEqual(self.db.users.find_one({"id": 2})["role"], "media")

    def test_admin_settings_write_requires_real_csrf_token(self):
        with self.client.session_transaction() as session:
            session.update({"user_id": 1, "role": "admin", "session_version": 0})
        missing_token = self.client.put("/api/settings", json={"church_name": "Changed"})
        self.assertEqual(missing_token.status_code, 400)

        token = self.client.get("/api/csrf-token").get_json()["csrf_token"]
        accepted = self.client.put(
            "/api/settings", json={"church_name": "Updated"}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(accepted.status_code, 200)
        self.assertEqual(self.db.settings.find_one({"id": "site"})["church_name"], "Updated")

    def test_csrf_accepts_allowlisted_cross_origin_https_frontend(self):
        with self.client.session_transaction(base_url="https://api.example.test") as session:
            session.update({"user_id": 1, "role": "admin", "session_version": 0})
        token = self.client.get("/api/csrf-token", base_url="https://api.example.test").get_json()["csrf_token"]
        response = self.client.put(
            "/api/settings",
            json={"church_name": "Cross-origin safe"},
            headers={
                "X-CSRFToken": token,
                "Origin": "https://cfckenya.vercel.app",
                "Referer": "https://cfckenya.vercel.app/admin/settings",
            },
            base_url="https://api.example.test",
        )
        self.assertEqual(response.status_code, 200)

    def test_image_upload_rejects_non_image_content_before_storage(self):
        self.assertIsNotNone(self.csrf_token(user_id=1, role="admin"))
        token = self.client.get("/api/csrf-token").get_json()["csrf_token"]
        response = self.client.post(
            "/api/upload",
            data={"file": (io.BytesIO(b"plain text masquerading as jpeg"), "fake.jpg")},
            headers={"X-CSRFToken": token},
        )
        self.assertEqual(response.status_code, 400)

    def test_upload_reencodes_images_and_discards_trailing_payload(self):
        image_bytes = io.BytesIO()
        Image.new("RGB", (8, 8), (20, 120, 40)).save(image_bytes, format="PNG")
        image_bytes.write(b"<script>payload</script>")
        stored = {}

        class FakeBucket:
            def put(self, stream, **metadata):
                stored.update(metadata)
                stored["bytes"] = stream.read()

        token = self.csrf_token(user_id=1, role="admin")
        with patch("app.routes.uploads.gridfs.GridFS", return_value=FakeBucket()):
            response = self.client.post(
                "/api/upload",
                data={"file": (io.BytesIO(image_bytes.getvalue()), "photo.png")},
                headers={"X-CSRFToken": token},
            )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(stored["content_type"], "image/png")
        self.assertNotIn(b"<script>", stored["bytes"])
        self.assertTrue(stored["bytes"].startswith(b"\x89PNG\r\n\x1a\n"))

    def test_admin_only_staff_role_changes(self):
        token = self.csrf_token(user_id=2, role="media")
        response = self.client.put(
            "/api/auth/users/2", json={"role": "admin"}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(response.status_code, 403)

        token = self.csrf_token(user_id=1, role="admin")
        response = self.client.put(
            "/api/auth/users/2", json={"role": "guest"}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.db.users.find_one({"id": 2})["role"], "media")

    def test_last_active_admin_cannot_be_demoted_disabled_or_deleted(self):
        token = self.csrf_token(user_id=1, role="admin")
        for method, path, payload, expected_status in (
            ("put", "/api/auth/users/1", {"role": "media"}, 409),
            ("put", "/api/auth/users/1", {"active": False}, 409),
            ("delete", "/api/auth/users/1", None, 400),
        ):
            response = getattr(self.client, method)(path, json=payload, headers={"X-CSRFToken": token})
            self.assertEqual(response.status_code, expected_status, response.get_json())
        self.assertEqual(self.db.users.find_one({"id": 1})["role"], "admin")

    def test_self_password_change_requires_admin_and_revokes_session(self):
        token = self.csrf_token(user_id=2, role="media")
        denied = self.client.post(
            "/api/auth/change-password",
            json={"old_password": "x", "new_password": "StrongPassword9!"},
            headers={"X-CSRFToken": token},
        )
        self.assertEqual(denied.status_code, 403)

        from werkzeug.security import generate_password_hash
        self.db.users.update_one(
            {"id": 1},
            {"$set": {"password": generate_password_hash("CurrentPassword9!")}},
        )
        token = self.csrf_token(user_id=1, role="admin")
        changed = self.client.post(
            "/api/auth/change-password",
            json={"old_password": "CurrentPassword9!", "new_password": "NewPassword9!"},
            headers={"X-CSRFToken": token},
        )
        self.assertEqual(changed.status_code, 200)
        self.assertEqual(self.db.users.find_one({"id": 1})["session_version"], 1)

    def test_staff_user_edit_endpoint_is_admin_only(self):
        token = self.csrf_token(user_id=2, role="media")
        response = self.client.put(
            "/api/auth/users/1", json={"email": "attacker@example.test"}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.db.users.find_one({"id": 1})["email"], "admin@example.test")

    def test_public_notifications_hide_inactive_records_and_internal_fields(self):
        response = self.client.get("/api/notifications")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["title"] for item in response.get_json()], ["Public"])

    def test_mpesa_callback_requires_configured_secret(self):
        response = self.client.post("/api/mpesa/callback", json={"Body": {}})
        self.assertIn(response.status_code, (404, 503))

    def test_mpesa_callback_does_not_create_unknown_transactions(self):
        self.app.config["MPESA_CALLBACK_TOKEN"] = "a-long-test-callback-secret"
        response = self.client.post(
            "/api/mpesa/callback?callback_token=a-long-test-callback-secret",
            json={"Body": {"stkCallback": {"CheckoutRequestID": "unknown", "MerchantRequestID": "fake", "ResultCode": 0}}},
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.db.mpesa_transactions.documents, [])

    def test_public_registration_and_password_recovery_are_disabled(self):
        for path in ("/api/auth/register", "/api/auth/forgot-password", "/api/auth/reset-password"):
            response = self.client.post(path, json={})
            self.assertEqual(response.status_code, 404, path)

    def test_cors_is_allowlisted_and_security_headers_are_present(self):
        trusted = self.client.get("/api/health", headers={"Origin": "http://localhost"})
        untrusted = self.client.get("/api/health", headers={"Origin": "https://attacker.example"})
        self.assertEqual(trusted.headers.get("Access-Control-Allow-Origin"), "http://localhost")
        self.assertIsNone(untrusted.headers.get("Access-Control-Allow-Origin"))
        self.assertEqual(trusted.headers.get("X-Content-Type-Options"), "nosniff")
        self.assertEqual(trusted.headers.get("X-Frame-Options"), "DENY")
        self.assertIn("frame-ancestors 'none'", trusted.headers.get("Content-Security-Policy", ""))

    def test_disabling_account_invalidates_existing_session(self):
        token = self.csrf_token(user_id=2, role="media")
        disabled = self.client.put(
            "/api/auth/users/2", json={"active": False}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(disabled.status_code, 403)

        token = self.csrf_token(user_id=1, role="admin")
        disabled = self.client.put(
            "/api/auth/users/2", json={"active": False}, headers={"X-CSRFToken": token}
        )
        self.assertEqual(disabled.status_code, 200)
        with self.client.session_transaction() as session:
            session.update({"user_id": 2, "role": "media", "session_version": 0})
        revoked = self.client.get("/api/auth/me")
        self.assertEqual(revoked.status_code, 401)


if __name__ == "__main__":
    unittest.main()