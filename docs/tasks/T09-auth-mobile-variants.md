# T09 — Mobile variants for registration, recovery, reset, access denied

**Phase**: 1 — Authentication and session edge states
**Area**: Authentication, Responsive
**Requirements**: L1-009, L2-001, L2-003, L2-007, L2-039
**Source**: Screen-Level Missing Inventory — "Mobile/tablet ... auth recovery/registration/reset, access denied"

## Goal

Produce mobile variants of the desktop-only auth screens so the entire auth surface meets the responsive requirement.

## Scope

- `Mobile / Register`
- `Mobile / Password Recovery` (form + sent state)
- `Mobile / Password Reset` (form + expired state)
- `Mobile / Access Denied`
- Tablet variants where layout meaningfully differs from mobile.

## Acceptance criteria

- [ ] Each mobile screen exists at the standard mobile width.
- [ ] Touch targets meet hit-target requirements (≥44px).
- [ ] Decorative background shapes are present and not unintentionally clipped.
- [ ] States from T01–T05 are mirrored into mobile where applicable.
