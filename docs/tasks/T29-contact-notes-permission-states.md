# T29 — Contact notes permission and over-limit states

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-013, L2-051
**Source**: Screen-Level Missing Inventory — "Contact notes edit/delete/permission/over-limit states"

## Goal

Cover the missing per-note states on contact detail.

## Scope

- Edit-note inline state with save/cancel.
- Delete-note confirmation dialog (covered generically; instantiate for contact context).
- Permission states: only the author and Administrator can edit/delete; show a tooltip or hide actions for others.
- Over-limit (4000-char) inline error and disabled save.
- Server rejection toast.

## Acceptance criteria

- [x] Edit-note state, delete confirmation, permission-hidden state, and over-limit state designed.
- [x] Counter behavior matches existing 0/4000 indicator.
