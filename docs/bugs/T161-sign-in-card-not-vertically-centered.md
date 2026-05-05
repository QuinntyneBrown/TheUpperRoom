# T161 — Sign-in card not vertically centred on desktop

**Status:** Open

## Description

The sign-in card (`/auth/sign-in`) renders at the top of the page instead of being vertically centred. The same issue affects all auth pages (register, forgot-password, reset-password, verify).

## Design (ui-design.pen)

Frame: `Desktop / Sign In` — container `signinCenter (Yelo6)`:
- `height: fill_container`, `justifyContent: center`, `alignItems: center`, `padding: $sp-12`

## Current Behaviour

`.auth-card` sits at the top of the viewport with no vertical spacing.

## Expected Behaviour

`.auth-card` is vertically and horizontally centred in the available viewport height.

## Failing Tests

`frontend/e2e/tests/auth/sign-in-vertical-center.spec.ts`
