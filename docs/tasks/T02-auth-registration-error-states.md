# T02 — Registration error and duplicate-email states

**Status**: Accepted
**Phase**: 1 — Authentication and session edge states
**Area**: Authentication
**Requirements**: L1-001, L2-001, L2-051, L2-055
**Source**: Screen-Level Missing Inventory — "Registration duplicate-email generic confirmation and password failure states"

## Goal

Show the registration screen's error/validation states: per-field validation, password-strength failure, and the generic "if your email is new we sent you a link" confirmation that avoids leaking account existence.

## Scope

- Field-level validation: missing display name, malformed email, missing city, password below strength threshold.
- Password failure state: strength meter in failure mode with corrective guidance.
- Submit-disabled state while the form is invalid.
- Generic post-submit confirmation: identical message regardless of whether the email already exists.
- Server/rate-limit rejection toast or inline message.

## Acceptance criteria

- [ ] Registration screen has invalid, password-failure, submitting, and post-submit-generic-confirmation variants.
- [ ] Error copy does not reveal duplicate-email information.
- [ ] Inline errors use the existing input-error component and meet AA contrast.
- [ ] Submitting state shows spinner and disabled CTA.
