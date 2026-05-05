# T21 — Mobile dialog variants

**Status**: Accepted
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

## Design notes

- **Form sheets** (`Mobile / New Partner Sheet`, `Mobile / Add Note Sheet`, `Mobile / New Contact` from T16) use **full-screen** presentation with a sticky `Cancel · title · Save` bar so the keyboard never overlaps the primary actions. Bottom 200—280 px is reserved for the on-screen keyboard.
- **Confirmation sheets** (`Mobile / Delete Confirmation Sheet`) use **bottom sheet** presentation — a half-height card sliding up from the bottom with a 4 px grabber at the top. Destructive primary action is full-width red, secondary cancel is full-width neutral.
- **Selection sheets** (`Mobile / Manage Roles Sheet`) use a **bottom sheet** presentation taller than confirmations because they hold multiple selectable rows. Sticky header carries `Cancel · title · Save`.
- **Critical interruptions** (`Mobile / Session Expired`) use a **centered modal** with backdrop scrim (focus has nowhere else to go); the scrim cannot be dismissed by tap.
- **Focus trap** — every sheet/dialog implements: focus moves to the first interactive element on open; Tab/Shift+Tab cycles within the sheet; Esc cancels; tap outside dismisses non-destructive sheets only. Annotated by the `Tab cycles inside dialog · focus trapped` footer copy.
- **Tablet centered modals** (`Tablet / New Partner Modal`, `Tablet / Delete Confirmation Modal`) use 400—560 px-wide centered cards with a backdrop scrim, header X close, and right-aligned action footer.

## Acceptance criteria

- [ ] Each existing or planned dialog has a mobile variant defined.
- [ ] Sheet headers include a clear close affordance.
- [ ] Focus is trapped inside the sheet/dialog.
