# T06 — Session-expired and re-authentication state

**Status**: Complete
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

## Design notes

- **Form-heavy screens** (`Desktop / Session Expired - Draft Preserved`): the modal opens over the in-progress form; a green "Draft saved locally" card explains that pending edits are persisted to local storage and will be restored after re-auth. CTAs are `Resume editing` (primary) and `Discard & sign out` (secondary).
- **Read-only screens** (`Desktop / Session Expired - Banner (Read-only)`): a top warning banner replaces the modal — the page is dimmed-functional only (no destructive controls), with `Sign in to continue` and `Sign out` actions in the banner.
- **Re-auth modal** (`Dialog / Session Expired`): focuses the password input on open. Email is pre-filled from the active session and locked. Tab cycles inside the dialog (focus trap), Esc maps to `Sign out` (destructive escape requires intent), Enter confirms.
- **Post re-auth**: the modal closes in place; banner version reloads the current view. No redirect to the dashboard, preserving the user's context.

## Acceptance criteria

- [x] `Dialog / Session Expired` (modal) exists with re-auth form and sign-out CTA.
- [x] Behavior on form-heavy screens (preserve draft) and on read-only screens (banner-only) is documented in design notes.
- [x] Focus is trapped inside the modal; first input focused on open.
