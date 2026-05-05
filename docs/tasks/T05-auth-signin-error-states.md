# T05 — Sign-in invalid/unverified/locked/loading states

**Status**: Accepted
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-002, L2-055
**Source**: Screen-Level Missing Inventory — "Sign-in invalid/unverified/locked-out/loading states"

## Goal

Add the missing sign-in failure and progress states so the form covers every realistic outcome.

## Scope

- Invalid credentials: generic "Email or password is incorrect" message that does not distinguish which field failed.
- Unverified account: prompt to verify email with a "Resend verification" link.
- Locked-out/throttled: countdown or "try again in N minutes" copy with optional support link.
- Loading/submitting: disabled inputs, spinner on the submit button.
- Field validation: required and malformed-email states.

## Acceptance criteria

- [ ] Each state appears as a variant of `Desktop / Sign In` and `Mobile / Sign In`.
- [ ] No state reveals whether the email exists.
- [ ] Lockout state references rate-limit policy without leaking exact thresholds.
- [ ] AA contrast verified across all states.
