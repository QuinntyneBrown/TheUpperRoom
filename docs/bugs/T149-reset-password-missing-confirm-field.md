# T149 — Reset password page missing confirm field, wrong button text

**Status**: Fixed ✓

## Description

The reset password page (`/auth/reset-password`) is missing several elements present in the design (`Desktop / Password Reset`):

1. **Missing "Confirm new password" field** (`rsP2`) — only "New password" exists; no re-entry field.
2. **Wrong button text** — shows "Reset password"; design says "Set new password" (`rsBtn`).
3. **Missing strength indicator** (`rsHint`) — no password strength feedback shown below the fields.
4. **Missing expiry notice** (`rsExp`) — no "Link expires in…" callout shown below the button.

Root cause: `reset-page.html` only has a single `<ur-input>` for `newPassword` and uses hardcoded "Reset password" as the button label.

## Fix

- Add `confirmPassword` signal and `passwordsMatch` computed to `ResetPageComponent`.
- Add `<ur-input>` for confirm password in the template.
- Change button label to "Set new password".
- Disable submit when passwords don't match; show inline mismatch error.
- Add strength hint text (computed from password value).
- Add expiry callout below the button.

## References

- Component: `frontend/projects/feature-auth/src/lib/reset-page/reset-page.ts`
- Template: `frontend/projects/feature-auth/src/lib/reset-page/reset-page.html`
- Design: `Desktop / Password Reset` → `rsP2`, `rsBtn`, `rsHint`, `rsExp`
