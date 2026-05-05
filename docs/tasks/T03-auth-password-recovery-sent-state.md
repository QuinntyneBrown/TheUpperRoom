# T03 — Password recovery sent-confirmation state

**Status**: Complete
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-003
**Source**: Screen-Level Missing Inventory — "Password recovery sent-confirmation"

## Goal

After the user submits the recovery form, show a generic confirmation state that does not leak whether the email is registered, with resend and back-to-sign-in affordances.

## Scope

- Confirmation panel replacing the form on submit.
- Generic copy: "If an account exists for <email>, we have sent reset instructions."
- Resend control with cooldown disabled state.
- Link back to sign-in.

## Acceptance criteria

- [x] `Desktop / Password Recovery - Sent` (or equivalent state on the existing frame) exists.
- [x] Copy is duplicate-safe (no account existence leak).
- [x] Cooldown/disabled state of resend is shown.
- [x] AA contrast verified.
