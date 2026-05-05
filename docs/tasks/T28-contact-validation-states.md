# T28 — Contact validation states

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-009, L2-011, L2-051
**Source**: Screen-Level Missing Inventory — "Contact validation states for malformed email/phone and missing required fields"

## Goal

Cover every validation outcome on the New Contact dialog and the Edit Contact form.

## Scope

- Required-field state: first name, last name, email.
- Malformed email and malformed phone states.
- Optional partner: invalid selection cleared.
- Server-rejection state with retry.
- Submit-disabled until valid.

## Acceptance criteria

- [x] Each invalid state appears as a variant on the relevant form.
- [x] Errors use the existing input-error component.
- [x] AA contrast verified.
