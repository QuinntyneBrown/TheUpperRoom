# T34 — Partner stage-change control

**Phase**: 5 — Partner and hackathon management
**Area**: Partner
**Requirements**: L1-004, L2-017
**Source**: Screen-Level Missing Inventory — "Partner stage-change control"

## Goal

Provide an explicit control on partner detail to move a partner between Lead, In Funnel, and Confirmed Partner.

## Scope

- Segmented control or stepper that highlights the current stage.
- Confirmation step when moving backward.
- Optional reason note for the change (free text, recorded in stage history).
- Submitting and success states; toast on success.
- Permission-gated state.

## Acceptance criteria

- [ ] Control exists on partner detail and reflects the current stage clearly.
- [ ] Backward-move confirmation designed.
- [ ] State emits a stage-history entry (links to T35).
