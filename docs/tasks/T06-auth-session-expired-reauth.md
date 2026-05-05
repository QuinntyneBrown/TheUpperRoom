# T06 — Session-expired and re-authentication state

**Phase**: 1 — Authentication and session edge states
**Area**: Authentication, Authorization
**Requirements**: L1-001, L1-002, L2-004, L2-007
**Source**: Screen-Level Missing Inventory — "Session-expired/re-auth state"

## Goal

Define the UX for an expired session: a banner/dialog that interrupts the current screen, asks the user to re-authenticate, and preserves their unsaved work where feasible.

## Scope

- Session-expired modal blocking primary content.
- Re-auth form (password only, email pre-filled) with cancel-and-sign-out.
- Toast/banner alternative for low-risk read screens.
- Post-reauth return-to-context behavior described.

## Acceptance criteria

- [ ] `Dialog / Session Expired` (modal) exists with re-auth form and sign-out CTA.
- [ ] Behavior on form-heavy screens (preserve draft) and on read-only screens (banner-only) is documented in design notes.
- [ ] Focus is trapped inside the modal; first input focused on open.
