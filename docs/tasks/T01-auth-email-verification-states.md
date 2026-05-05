# T01 — Email verification states

**Status**: Accepted
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-001
**Source**: Screen-Level Missing Inventory — "Email verification pending/success/expired states"

## Goal

Add the three email-verification visual states a user lands on after registering: a "check your email" pending state, a confirmed-success state, and an expired/invalid-link state with a resend affordance.

## Scope

- Pending state: shown after registration submit. Communicates "verification email sent to <email>", with resend link (rate-limited copy) and change-email/back-to-sign-in link.
- Success state: reached from the email link. Confirms account is verified, primary CTA to sign in (or auto-redirects after countdown).
- Expired/invalid state: reached when the link is stale or already used. Explains why, primary CTA to request a new link, secondary CTA to sign in.
- Desktop and mobile variants (mobile variant overlaps with T09).

## Acceptance criteria

- [ ] Three distinct frames exist under `Desktop / Email Verification - Pending`, `... Success`, `... Expired`.
- [ ] Copy is generic and does not leak whether an email exists in the system (per L2-001 duplicate-safe behavior).
- [ ] Resend control shows disabled/cooldown state.
- [ ] All three states meet AA contrast on the dark theme.
- [ ] Snapshot reports no clipping.
