# Security Remediation Status

Assessment baseline: CFC penetration-test report dated 2026-09-30. This record describes repository changes and local verification; it is not a certification or a claim that the application is fully secure.

## Implemented and Verified

| Area | Control | Verification |
|---|---|---|
| Authentication | Login rejects disabled accounts, clears the prior session before establishing a new one, and has per-IP/per-account rate limits. | Login throttle regression test returns 429. |
| Authorization | Protected routes resolve the current account and role from MongoDB; custom permissions cannot exceed role permissions. User/role/password administration is admin-only. | Anonymous and media-role write regressions; all registered API write routes checked without session/CSRF. |
| Passwords | Passwords require 12-128 characters including upper/lowercase, a digit, and a symbol. Admin password changes verify the current password, update session version, audit, and log out. Public registration/recovery/self-service password routes are disabled. | Admin-only password, role assignment and session invalidation tests. |
| Sessions / CSRF | Flask-WTF CSRF tokens are random and session-bound. All browser state-changing routes are protected except the token-protected Daraja callback. Session cookies remain HttpOnly and Secure in production. | Missing/valid token tests, including the allowlisted Vercel-to-Render HTTPS origin. |
| CORS | Credentialed CORS uses exact origins; production detection covers Render even if `FLASK_ENV` is unset. | Allowed and unlisted-origin response-header test. |
| Uploads | Staff-only JPEG/PNG/WebP allowlist, byte/pixel/side limits, Pillow decode and re-encode, generated filenames, safe raster-only serving, `nosniff`, and sandbox CSP. Legacy disk files are also decoded before serving. | Anonymous upload, invalid content, and appended-payload re-encoding tests. |
| Public data | Serializers use explicit field allowlists; inactive notifications and draft content are not returned publicly. Public list endpoints have a maximum page size. | Inactive notification and serializer regression test. |
| Payment flow | STK initiation is throttled, simulated completion is disabled in production, callback token and known pending checkout are required, success metadata is matched, duplicate/unknown callbacks cannot create or rewrite transactions, transaction lists are staff-only, and provider payloads/secrets are not logged. | Callback-secret and unknown-checkout tests. |
| Abuse / logging | Global request limits, security audit events with actor/action/target/outcome/time/request ID, generic API error responses, and baseline CSP/security headers. | Rate-limit, response-header, build and compile checks. |
| Dependencies | Frontend React Router/Vite advisories fixed; Python requirements upgraded to pip-audit fixed versions. | `npm audit` reports zero vulnerabilities; `pip-audit -r backend/requirements.txt` reports none. |

## Verification Run

- `python -m unittest discover -s tests -v`: 23 tests passed.
- `python -m compileall -q app tests`: passed.
- `npm run build`: passed with Vite 6.4.3.
- `npm audit`: zero known vulnerabilities.
- `pip-audit -r backend/requirements.txt`: no known vulnerabilities.
- `git diff --check`: passed for the remediation changes.

## Production Actions Still Required

- Rotate the Render `SECRET_KEY`, database credentials, M-PESA credentials, and any other potentially exposed secrets. This cannot be done from this repository; configure them in the deployment secret store and restart the service to invalidate old signed sessions.
- Set Render `APP_ENV=production`, exact `CORS_ORIGINS=https://cfckenya.vercel.app`, `SESSION_COOKIE_SAMESITE=None` for the current split-site deployment, a strong `SECRET_KEY` of at least 32 characters, `MPESA_CALLBACK_TOKEN` (long random secret), and a shared Redis-compatible `RATELIMIT_STORAGE_URI`. In-memory limits reset on restart and are not shared across Render instances.
- Update `MPESA_CALLBACK_URL` to the live HTTPS API callback URL. Confirm Daraja preserves the callback query token; if it does not, move the token to a supported authenticated callback path or an API gateway secret header.
- Review Render/Cloudflare logs for exploitation of uploads, settings, livestream, and user endpoints. Remove the specific test uploads/settings/users identified in the report and compare production records to a known-good backup. No live production database or logs were accessed during this work.
- Restore-test encrypted MongoDB backups, restrict the database user/network to least privilege, and verify TLS/network rules in MongoDB Atlas.
- Configure staging with separate database, storage, and credentials. Re-run an independent black-box penetration test against the deployed domains after deployment.

## Residual Risk

- Flask's default session remains a signed client-side cookie. Its integrity depends on protecting/rotating `SECRET_KEY`; production rotation is outstanding.
- Uploaded images are re-encoded and restricted to raster formats, but they are still served from the API origin rather than a separate cookie-less media origin.
- The Daraja callback bearer token is carried in the callback URL query string and may appear in provider/proxy access logs; use an authenticated gateway/header if supported and redact query strings in logs.
- Per-account/IP rate limits use the configured storage backend. Production needs shared Redis for consistent limits across workers.
- Public church content remains intentionally readable without login. Review which published sermons, events, staff biographies, ministry contacts, giving instructions, and settings fields are meant for public release.
- No MFA, restore test, production-secret rotation, production data cleanup, provider callback retest, or post-deployment penetration retest was performed here.