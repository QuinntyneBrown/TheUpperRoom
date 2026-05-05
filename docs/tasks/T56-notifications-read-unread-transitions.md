# T56 — Notification read/unread transitions

**Status**: Accepted
**Phase**: 7 — Notifications and real-time lifecycle
**Area**: Notifications
**Requirements**: L1-008, L2-038
**Source**: Screen-Level Missing Inventory — "Notification read/unread transition states"

## Goal

Define how individual notifications visually transition between unread and read.

## Scope

- Unread row: accent dot + heavier weight + slightly elevated surface.
- Read row: muted text + no dot.
- Hover-to-read toggle (icon on the row) with tooltip.
- Click-through behavior: mark as read on click and navigate to source.
- Animation/duration spec for the transition.

## Acceptance criteria

- [ ] Unread, read, hover-to-toggle, and click-to-navigate states designed.
- [ ] Unread treatment is detectable without color alone (icon/weight) per accessibility (T58/T59).
