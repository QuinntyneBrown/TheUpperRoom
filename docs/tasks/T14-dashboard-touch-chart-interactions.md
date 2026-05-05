# T14 — Touch chart interactions

**Status**: Accepted
**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard, Responsive
**Requirements**: L1-007, L1-009, L2-034, L2-039
**Source**: Screen-Level Missing Inventory — "touch chart interactions"

## Goal

Define how a user inspects, scrubs, and reads chart values on touch devices where hover does not exist.

## Scope

- Tap-to-reveal data point tooltip with persistent dismiss.
- Long-press to scrub across the series.
- Pinch-to-zoom or pagination for dense series (decide one).
- Legend interaction: tap to toggle a series.
- States across mobile and tablet chart cards.

## Acceptance criteria

- [ ] Tooltip, scrub, and legend-toggle states are designed for mobile and tablet chart cards.
- [ ] Touch targets meet hit-target requirements.
- [ ] No reliance on hover for any meaningful chart interaction.
