# T150 — Forgot password page missing security notice and wrong button label

**Status**: Fixed ✓

## Description

The forgot password page (`/auth/forgot-password`) has two issues vs the design (`Desktop / Password Recovery`):

1. **Missing security notice** (`rcAlert`) — The design shows an info callout below the submit button with title "For security" and body "We respond the same way whether or not the email is registered." This is absent from the current template.
2. **Wrong button label** — app shows "Send reset link"; desktop design (`rcBtn`) shows "Send recovery link".

## Fix

- Change button text from "Send reset link" to "Send recovery link".
- Add a security notice `<p>` below the button in the form with `data-testid="recover-security-notice"`.

## References

- Component: `frontend/projects/feature-auth/src/lib/recover-page/recover-page.ts`
- Template: `frontend/projects/feature-auth/src/lib/recover-page/recover-page.html`
- Design: `Desktop / Password Recovery` → `rcBtn`, `rcAlert`
