# T32 — Partner edit form

**Status**: Accepted
**Phase**: 5 — Partner and hackathon management
**Area**: Partner
**Requirements**: L1-004, L2-020
**Source**: Screen-Level Missing Inventory — "Partner edit form"

## Goal

Add the edit-partner form reached from the existing Edit button on the partner detail screen.

## Scope

- Pre-filled fields: organization name, city, website, status, summary, owner.
- Save, Cancel, dirty-indicator.
- Inline validation (required name; URL format on website).
- Submitting and success states.
- Permission-gated read-only state for non-owners/non-admins.

## Acceptance criteria

- [ ] Edit form covers pristine, dirty, validating, error, submitting, success.
- [ ] Stage label uses "Confirmed Partner" not abbreviated "Confirmed".
- [ ] Mobile/tablet variants per T22.
