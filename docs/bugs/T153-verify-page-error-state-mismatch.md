# T153 — Verify email error state doesn't match design

**Status**: Fixed ✓

## Description

The email verification error page (`/auth/verify?token=...` with invalid token) doesn't match the design (`Desktop / Email Verification - Expired`):

1. **Wrong heading** — app shows no styled heading, only a plain paragraph. Design shows "This link can't be used" as the card heading.
2. **Wrong error body** — app says "The verification link is invalid, expired, or has already been used." Design says "The verification link is expired or has already been used. Request a new one and we'll send it right over."
3. **Wrong action** — app shows "Register again" link to `/auth/register`. Design shows "Back to sign in" link.
4. **No success state** — design shows "Email verified" confirmation card with "Sign in to continue" button before redirecting. App redirects immediately with no confirmation.

Root cause: `verify-page.html` only has a `<p>` tag for the error state with no structure matching the design card layout.

## Fix (scope: heading, body text, action link — resend flow deferred)

- In the error state, add `data-testid="verify-error-heading"` heading "This link can't be used".
- Update error body text to match design.
- Change "Register again" link to "Back to sign in" at `/auth/sign-in`.
- Add a success state card with "Email verified" heading and "Sign in to continue" link (shown briefly before redirect).

## References

- Template: `frontend/projects/feature-auth/src/lib/verify-page/verify-page.html`
- Design: `Desktop / Email Verification - Expired` → card `nUzR5`
- Design: `Desktop / Email Verification - Success` → card `rRfLH`
