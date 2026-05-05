# T43 — Hackathon stage advance/retreat control

**Status**: Accepted
**Phase**: 5 — Partner and hackathon management
**Area**: Hackathon
**Requirements**: L1-005, L2-023
**Source**: Screen-Level Missing Inventory — "Hackathon stage advance/retreat control"

## Goal

Provide explicit controls to move a hackathon between Discover, Design, Develop, and Deploy.

## Scope

- Stepper or segmented control on hackathon detail.
- Advance and Retreat buttons with confirmation when retreating.
- Optional reason note recorded in stage history.
- Permission-gated state.

## Acceptance criteria

- [ ] Control exists on hackathon detail showing the current stage.
- [ ] Retreat confirmation dialog designed.
- [ ] Emits stage-history entry (T44).
