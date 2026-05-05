# T33 — Partner delete confirmation

**Status**: Complete
**Phase**: 5 — Partner and hackathon management
**Area**: Partner
**Requirements**: L1-004, L2-020
**Source**: Screen-Level Missing Inventory — "Partner delete confirmation"

## Goal

Add a destructive-action confirmation dialog for deleting a partner.

## Scope

- Confirmation dialog with consequences listed: contact associations removed, notes preserved/anonymized, any hackathon sponsorship references.
- Destructive Delete CTA + Cancel.
- Post-delete toast with optional Undo.
- Permission-gated absent state.

## Acceptance criteria

- [x] Dialog frame exists with destructive button styling.
- [x] Side effects listed in copy match L2-020.
- [x] Mobile bottom-sheet variant per T21.
