# T07 — Sign-out control and signed-out redirect

**Status**: Complete
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-005
**Source**: Screen-Level Missing Inventory — "Sign-out control and signed-out redirect state"

## Goal

Add a discoverable sign-out control to authenticated navigation and define the post-sign-out landing state.

## Scope

- Profile menu in the desktop top bar containing "Sign out".
- Mobile bottom-nav profile/settings entry containing "Sign out".
- Signed-out landing: redirect to `Desktop / Sign In` with a confirmation toast "You have been signed out".
- Confirmation prompt before sign-out only if there is unsaved work (otherwise immediate).

## Acceptance criteria

- [x] Sign-out control is reachable from every authenticated screen via the top bar / profile menu.
- [x] Mobile variant present (overlaps with T09).
- [x] Signed-out toast shown on the sign-in screen after redirect.
