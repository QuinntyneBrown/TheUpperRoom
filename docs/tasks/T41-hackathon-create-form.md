# T41 — Hackathon create form

**Status**: Complete
**Phase**: 5 — Partner and hackathon management
**Area**: Hackathon
**Requirements**: L1-005, L2-022
**Source**: Screen-Level Missing Inventory — "Hackathon create form"

## Goal

Replace the placeholder "+ Plan hackathon" CTA with an actual create flow.

## Scope

- Form fields: name, host city, start date, end date, sponsoring partners (multi-select), description.
- Date validation: end ≥ start, both required.
- Partner association at creation: searchable picker.
- Submitting, validation-error, success, and server-rejection states.

## Acceptance criteria

- [x] Create form designed at desktop and mobile.
- [x] Date-range validation state shown.
- [x] Sponsor picker handles loading/empty.
