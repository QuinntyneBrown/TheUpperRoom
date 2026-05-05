# T24 — Contact edit form

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-011
**Source**: Screen-Level Missing Inventory — "Contact edit form"

## Goal

Define the edit-contact form reached from the existing contact detail Edit button, including field-level validation and save states.

## Scope

- Edit form pre-filled with current values: first name, last name, email, phone, role, city, optional partner.
- Save, Cancel, and dirty-state indicator.
- Inline validation errors per field.
- Save-in-progress (disabled CTA + spinner).
- Success toast on save and return to detail view.
- Permission-gated state for users without edit rights (read-only with locked icon).

## Acceptance criteria

- [x] Spec-aligned: separate first-name and last-name fields (per L2-009/L2-011 note).
- [x] All form states represented: pristine, dirty, validating, error, submitting, success.
- [x] Mobile/tablet variants follow T16.
