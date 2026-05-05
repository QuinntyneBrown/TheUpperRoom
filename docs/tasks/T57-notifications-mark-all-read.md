# T57 — Mark-all-read completion state

**Status**: Complete
**Phase**: 7 — Notifications and real-time lifecycle
**Area**: Notifications
**Requirements**: L1-008, L2-038
**Source**: Screen-Level Missing Inventory — "Mark-all-read completion state"

## Goal

Define the behavior immediately after a user clicks "Mark all read".

## Scope

- Optimistic update of all visible rows.
- Snackbar/toast with Undo for the affected items.
- Confirmation dialog when N is large (e.g., > 50).
- Server-rejection rollback state.

## Acceptance criteria

- [x] Optimistic-update, undo, large-N confirm, and rollback states designed.
- [x] Mobile variant per T18.
