# Email Verification

Landing pages for the email verification token link.

## How to navigate

No login required — these pages are reached by clicking the link in the verification email.

1. Register a new account (see [register](register.md)) so a verification email is sent.
2. Open the verification link from the email → `/verify-email?token=...`.
3. The state shown depends on the token:
   - **Pending** (`hvMz5`) — page render while the token is being validated.
   - **Success** (`GiGKl`) — token valid; account marked verified.
   - **Expired** (`YDmE0`) — token past TTL; user is offered to resend.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Email Verification - Pending | `hvMz5` | Desktop 1440×1024 | Token being verified |
| Desktop / Email Verification - Success | `GiGKl` | Desktop | Verified |
| Desktop / Email Verification - Expired | `YDmE0` | Desktop | Token expired |
