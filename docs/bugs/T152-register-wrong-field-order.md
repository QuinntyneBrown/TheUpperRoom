# T152 — Register form has wrong field order and missing password hint

**Status**: Fixed ✓

## Description

The register form (`/auth/register`) has two issues vs the design (`Desktop / Register`):

1. **Wrong field order** — Design order: Display name → Email → City → Password. App order: Display name → Email → Password → City. Password and City are swapped.

2. **Missing password hint** (`regHint`) — Design shows "Use 12+ characters with a mix of letters, numbers, symbols." below the Password field. This is absent from the current template.

Root cause: `register-page.html` lists `<ur-input label="Password">` before `<ur-input label="City">`.

## Fix

- Swap the Password and City `<ur-input>` blocks in `register-page.html`.
- Add `<p class="auth-hint">Use 12+ characters with a mix of letters, numbers, symbols.</p>` after the Password field with `data-testid="register-password-hint"`.

## References

- Template: `frontend/projects/feature-auth/src/lib/register-page/register-page.html`
- Design: `Desktop / Register` → `regCity` (TS707), `regPw` (nhpDu), `regHint` (HkWuq)
