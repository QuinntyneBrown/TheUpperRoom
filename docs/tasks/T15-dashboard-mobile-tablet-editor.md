# T15 — Mobile and tablet dashboard editor

**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard, Responsive
**Requirements**: L1-007, L1-009, L2-033, L2-040, L2-041
**Source**: Screen-Level Missing Inventory — "Mobile/tablet dashboard editor variants"

## Goal

Translate the desktop editor model to small and medium viewports, including the empty state, edit mode, widget catalog, and saved/restored states.

## Scope

- `Mobile / Dashboard - Empty` and `Mobile / Dashboard - Edit Mode` (single column).
- `Tablet / Dashboard - Empty` and `Tablet / Dashboard - Edit Mode`.
- Mobile widget catalog (full-screen sheet) and tablet variant.
- Stack/reorder gesture model for mobile (no resize).
- 12-column behavior reaffirmed for ≥1200px (links to L2-041).

## Acceptance criteria

- [ ] Empty, edit-mode, populated, and widget-catalog variants exist for mobile and tablet.
- [ ] Mobile editor degrades gracefully (reorder only, no resize).
- [ ] Tablet editor supports 6 or 8 columns as appropriate, documented in design notes.
