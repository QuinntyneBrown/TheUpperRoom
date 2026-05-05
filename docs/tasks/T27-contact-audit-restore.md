# T27 — Contact audit and restore state

**Status**: Accepted
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-012
**Source**: Screen-Level Missing Inventory — "Contact audit/restore state"

## Goal

Provide an Administrator-only view that lists soft-deleted contacts with an audit trail and a restore action.

## Scope

- `Desktop / Contacts - Archive` (or similar) showing soft-deleted contacts.
- Audit columns: deleted by, deleted at, reason (if captured).
- Restore action with confirmation.
- Empty state.
- Permission-gated entry point in the Contacts toolbar.

## Acceptance criteria

- [ ] Archive list, restore confirmation, and empty state exist.
- [ ] Visible only to Administrator role (annotated).
- [ ] Mobile variant per T16.
