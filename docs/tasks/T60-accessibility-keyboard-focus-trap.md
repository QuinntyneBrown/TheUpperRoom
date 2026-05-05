# T60 — Keyboard navigation and modal focus trap

**Status**: Accepted
**Phase**: 9 — Accessibility annotations
**Area**: Accessibility
**Requirements**: L1-015, L2-057
**Source**: Screen-Level Missing Inventory — "Accessibility ... modal focus-trap ... annotations"

## Goal

Annotate keyboard navigation flow and focus-trap behavior for every dialog and overlay, plus tab order on each primary screen.

## Scope

- Tab-order arrows or numbered annotations on each primary screen (sign-in, dashboard, contacts, partners, hackathons, team, notifications, settings).
- Modal focus-trap notes: first focused element on open, return focus on close, Esc-to-close behavior.
- Skip-to-content link in navigation.
- Keyboard equivalents for chart and dashboard editor gestures (links to T11, T14).

## Acceptance criteria

- [ ] Tab-order annotations exist on the listed primary screens.
- [ ] Focus-trap and return-focus annotations exist on every dialog frame.
- [ ] Skip link is documented in the side-nav component.
