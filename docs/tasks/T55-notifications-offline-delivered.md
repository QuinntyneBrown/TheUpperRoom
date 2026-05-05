# T55 — Offline-delivered notification state

**Status**: Complete
**Phase**: 7 — Notifications and real-time lifecycle
**Area**: Notifications
**Requirements**: L1-008, L2-037, L2-038
**Source**: Screen-Level Missing Inventory — "Offline-delivered notification state"

## Goal

Show how notifications that arrived while the user was offline are surfaced when they reconnect.

## Scope

- Notification center grouping: "While you were away (N)" section above recent items.
- Per-item "delivered offline" subtle marker (icon or muted timestamp).
- Reconnect toast that summarizes count: "12 new notifications since you reconnected. View".
- Order: newest first; group expands by default and remembers state.

## Acceptance criteria

- [x] Grouping, marker, and reconnect toast designed.
- [x] Mobile variant per T18.
