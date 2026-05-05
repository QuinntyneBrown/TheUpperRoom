# T158 — Sign-in page link colours use browser default blue instead of accent-primary

**Status:** Fixed ✓

## Description

On `/auth/sign-in`, the "Forgot password?" and "Request access" links render in the browser's default blue (`#0000EE` / similar) instead of the design's `$accent-primary` (`#9F86FF`).

## Design (ui-design.pen)

Frame: `Desktop / Sign In`, node `R7sFzi` → card

- `optsRow (P277Z)` → "Forgot password?": `fill: $accent-primary (#9F86FF)`, `fontSize: $fs-sm (12px)`, `fontWeight: 500`
- `signupRow (xRGIr)` → "Request access": `fill: $accent-primary (#9F86FF)`, `fontSize: $fs-sm (12px)`, `fontWeight: 500`

## Current Behaviour

Both links display in browser-default blue; no colour override is applied.

## Expected Behaviour

Both links display in `var(--ur-accent-primary, #9f86ff)`, no underline by default, underline on hover.

## Failing Tests

`frontend/e2e/tests/auth/sign-in-link-colors.spec.ts`
