# T151 — Sign-in page "Forgot password?" link is misplaced and subtitle is missing

**Status**: Fixed ✓

## Description

The sign-in page (`/auth/sign-in`) has two issues vs the design (`Desktop / Sign In`):

1. **"Forgot password?" link is misplaced** — In the design it appears in `optsRow` between the Password field and the Sign in button (right-aligned). In the current app it is in a separate `<p>` below the Sign in button and below the "Request access" link.

2. **Missing subtitle** (`signinHead`) — The design shows "Sign in to your City Lead workspace" as a subtitle below the logo in the card header. This is absent from the current template.

Root cause: `sign-in-page.html` appends the "Forgot password?" link as a final paragraph outside the `<form>` block, rather than placing it in an opts row inside the form between the password field and the submit button.

## Fix

- Move `<a routerLink="/auth/forgot-password">Forgot password?</a>` into the form, after the password `<ur-input>` and before `<ur-button>`, wrapped in a right-aligned opts container.
- Remove the trailing `<p><a ...>Forgot password?</a></p>` from outside the form.
- Add subtitle paragraph "Sign in to your City Lead workspace" to the card heading.

## References

- Template: `frontend/projects/feature-auth/src/lib/sign-in-page/sign-in-page.html`
- Design: `Desktop / Sign In` → `optsRow` (P277Z), `signinHead` (RPuf3)
