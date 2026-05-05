# T25 — Contact delete confirmation

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-012
**Source**: Screen-Level Missing Inventory — "Contact delete confirmation"

## Goal

Add a destructive-action confirmation dialog for deleting a contact, including the side effects (note authorship, partner association).

## Scope

- Confirmation dialog: "Delete <contact name>?" with copy explaining the consequences.
- Lists implications (notes preserved/anonymized; partner association removed).
- Destructive Delete CTA + Cancel.
- Post-delete toast with Undo (links to soft-delete in T27).
- Permission-gated absent state for users without delete rights.

## Acceptance criteria

- [x] Dialog exists with destructive button styling.
- [x] Copy describes side effects accurately.
- [x] Undo path described (or omitted with rationale).
- [x] Mobile bottom-sheet variant per T21.
