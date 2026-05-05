# T04 — Password reset expired/used link state

**Status**: Accepted
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-003
**Source**: Screen-Level Missing Inventory — "expired/already-used link states"

## Goal

When a user opens an expired or already-used reset link, show an explanatory state that lets them request a new link without exposing whether the original email exists.

## Scope

- Expired state: explains the link is no longer valid; primary CTA "Request a new reset link"; secondary "Back to sign in".
- Already-used state: similar layout, copy notes the link has already been redeemed.
- Optional: forced re-sign-in prompt after a successful reset (post-reset success state).

## Acceptance criteria

- [ ] Expired and already-used states exist as variants of `Desktop / Password Reset`.
- [ ] Generic, duplicate-safe copy.
- [ ] Successful-reset state directs the user back to sign-in (does not auto-authenticate).
