# T49 — Team role assignment/revocation dialog

**Status**: Complete
**Phase**: 6 — Team administration and authorization
**Area**: Team, Authorization
**Requirements**: L1-002, L1-006, L2-006, L2-029
**Source**: Screen-Level Missing Inventory — "Team role assignment/revocation dialog"

## Goal

Replace the placeholder "Manage roles" button with a functional role-assignment dialog.

## Scope

- `Dialog / Manage Roles`: list of team members with role checkboxes/toggles.
- Add-role and revoke-role actions with confirmation for last-active-lead constraint.
- Constraint warnings (e.g., "Cannot revoke the only active City Lead").
- Submitting, success, and error states.

## Acceptance criteria

- [x] Dialog designed with member list, role toggles, and constraint warnings.
- [x] Save/Cancel and dirty-state behavior defined.
- [x] Mobile variant per T21.
