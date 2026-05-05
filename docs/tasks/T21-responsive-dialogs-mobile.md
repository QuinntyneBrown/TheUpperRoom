# T21 — Mobile dialog variants

**Phase**: 3 — Responsive coverage and clipping fixes
**Area**: Dialogs, Responsive
**Requirements**: L1-009, L2-039, L2-040
**Source**: Screen-Level Missing Inventory — "Mobile/tablet ... dialogs"

## Goal

Convert dialogs that exist only at desktop width into mobile bottom sheets or full-screen sheets.

## Scope

- New Contact, New Partner, Add/Edit Note, Delete confirmation, Manage Roles, Widget Catalog, Session Expired, and other dialogs added by later tasks.
- Mobile presentation: full-screen sheet for forms, bottom sheet for confirmations, top-anchored toast for non-blocking.
- Tablet presentation: centered modal with adjusted width.

## Acceptance criteria

- [ ] Each existing or planned dialog has a mobile variant defined.
- [ ] Sheet headers include a clear close affordance.
- [ ] Focus is trapped inside the sheet/dialog.
