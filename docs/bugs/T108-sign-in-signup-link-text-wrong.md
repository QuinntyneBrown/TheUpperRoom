# T108 — Sign-in page signup link text wrong

**Status:** Fixed

**Route:** `/auth/sign-in`

**Description:**
The signup link in the sign-in card shows "Create an account" as a standalone paragraph link. The design specifies a `signupRow` with two inline elements: "New to The Upper Room?" (secondary text) and "Request access" (accent link).

**Design reference:** `Desktop / Sign In` → signinCard → signupRow
- Text: "New to The Upper Room?"
- Link: "Request access"

**Steps to reproduce:**
1. Navigate to `/auth/sign-in`
2. Observe the signup link below the Sign in button

**Expected:** `New to The Upper Room? Request access`
**Actual:** `Create an account`

**Component:** `sign-in-page.html` line 39
