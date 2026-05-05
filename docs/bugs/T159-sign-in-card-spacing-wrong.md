# T159 — Sign-in card section spacing off — elements run together without gap

**Status:** Fixed ✓

## Description

The sign-in card (`.auth-card`) is missing `display: flex; flex-direction: column` with a consistent gap between its sections. As a result:

- "Forgot password?" link sits flush against the Password input with zero visible gap.
- "Sign in" button sits flush against "Forgot password?" with zero visible gap.
- Subtitle, heading, form, and signup row all lack uniform spacing.
- "New to The Upper Room? Request access" runs together as a single block with no spacing between the two text parts.

## Design (ui-design.pen)

Frame: `Desktop / Sign In`, card node `R7sFzi`:
- `gap: 32px` between all direct card children (head, email field, password field, opts row, button, signup row)
- `signupRow (xRGIr)`: `gap: 8px` between the two text parts, `justifyContent: center`
- `optsRow (P277Z)`: `justifyContent: space_between` (remember-me left, forgot-password right)
- Font sizes: subtitle `$fs-sm (14px)`, `$fg-secondary` colour; links `$fs-sm (12px)`

## Current Behaviour

`.auth-card` has no flex layout; children stack with browser-default block margins. Form fields have no gap. Signup row has no gap or centering.

## Expected Behaviour

Card sections separated by 32px gap. Form fields separated by 16px gap. Subtitle coloured `$fg-secondary`. Signup row centred with 8px gap between parts.

## Failing Tests

`frontend/e2e/tests/auth/sign-in-card-spacing.spec.ts`
