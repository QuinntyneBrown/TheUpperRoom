# T40 — Partner validation and permission states

**Phase**: 5 — Partner and hackathon management
**Area**: Partner
**Requirements**: L1-002, L1-004, L2-016, L2-019, L2-020, L2-051
**Source**: Screen-Level Missing Inventory — "Partner validation and permission-specific states"

## Goal

Cover validation outcomes for partner forms and the role-gated states across partner screens.

## Scope

- Add Partner / Edit Partner: required-field, malformed URL, malformed phone (if applicable), server rejection states.
- Partner notes: 4000-char over-limit and rejection states.
- Permission-gated states for actions a non-owner/non-admin cannot perform: hidden, disabled with tooltip, or locked icon.

## Acceptance criteria

- [ ] All listed validation states represented as form/component variants.
- [ ] Permission-gated states documented for: edit partner, delete partner, change stage, manage notes, manage associations.
