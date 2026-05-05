# T16 — Mobile and tablet contact variants

**Status**: Accepted
**Phase**: 3 — Responsive coverage and clipping fixes
**Area**: Contacts, Responsive
**Requirements**: L1-003, L1-009, L2-039, L2-040
**Source**: Screen-Level Missing Inventory — "Mobile/tablet contact list, detail, and create variants"

## Goal

Produce mobile and tablet variants for the entire contact surface so contacts meet the responsive requirement.

## Scope

- `Mobile / Contacts` (card list with collapsed sort/filter controls).
- `Mobile / Contact Detail` (single-column with stacked notes).
- `Mobile / New Contact` (full-screen sheet).
- `Tablet / Contacts` and `Tablet / Contact Detail`.

## Design notes

- **Mobile (≤ 767 px)** — single-column card list, 56 px FAB for "+ new contact", filter/sort entry points sit in a sticky pill row that opens a bottom sheet (`Mobile / Contacts - Filter Sheet`).
- **Mobile detail** — hero with avatar/name/role + chip badges, three primary actions (Call · Email · Text) at the top, then stacked cards for Details and Notes. Bottom sheet pattern keeps thumb-reach actions near the bottom.
- **Mobile new contact** — full-screen sheet with sticky *Cancel · New contact · Save* header; required fields marked with `*`; bottom 200 px reserved for the iOS/Android keyboard.
- **Tablet (768—1199 px)** — same card list with three columns (Name | Partner | Role), `New contact` becomes a full button in the top bar. Detail page is two-column: left card stack (avatar/details) and right column (notes + activity timeline).
- **List pagination** — chose **infinite scroll on mobile** (`Loading more…` row at bottom of list) for one-handed thumb scrolling, and the same pattern on tablet for consistency. Pagination controls would force returning to top after every page; infinite scroll keeps focus on the user's current contact.
- **Hit targets** — every interactive control is ≥ 32 px (filter/sort pills, list rows are 64 px tall, FAB is 56 × 56, top-bar buttons 28 px with full-width tap area).

## Acceptance criteria

- [ ] All four mobile screens and two tablet screens exist.
- [ ] Filter and sort controls are accessible via a sheet/drawer on mobile.
- [ ] Touch targets meet hit-target requirements.
- [ ] List supports infinite scroll OR mobile pagination control (decide and document).
