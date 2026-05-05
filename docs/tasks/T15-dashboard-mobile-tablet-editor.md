# T15 — Mobile and tablet dashboard editor

**Status**: Accepted
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

## Design notes

- **Mobile (≤ 767 px)** — single-column stack of widgets at full width.
  - Empty (`Mobile / Dashboard - Empty`): centered illustration + single CTA "Add your first widget".
  - Edit Mode (`Mobile / Dashboard - Edit Mode`): header swaps to *Cancel · Edit dashboard · Save*; each widget collapses to a 120 px-tall row with a 18 px grip handle (drag to reorder), a 32 × 32 destructive remove button, and an "Add widget" placeholder at the bottom. **Resize is disabled on mobile** — only reorder is supported.
  - Catalog (`Mobile / Widget Catalog`): full-screen sheet with sticky search and a vertically-scrolling featured list. Selected items show a green check; not-yet-added items show an accent `+`.
- **Tablet (768—1199 px)** — 6-column grid, drag *and* resize enabled.
  - Empty (`Tablet / Dashboard - Empty`): larger hero with template + add-widget split.
  - Edit Mode (`Tablet / Dashboard - Edit Mode`): widgets render in two columns by default; full editor chrome (drag handle, cog, remove, dashed accent border) carries over from T10 desktop.
  - Catalog (`Tablet / Widget Catalog`): 3-up grid arranged by section (Featured, Operations …); items already on the dashboard are subtly outlined and labelled "✓ added".
- **Desktop (≥ 1200 px)** — falls back to the existing 12-column behavior already specified by L2-041 and rendered in T10 (`Desktop / Dashboard - Edit Mode`).

## Acceptance criteria

- [ ] Empty, edit-mode, populated, and widget-catalog variants exist for mobile and tablet.
- [ ] Mobile editor degrades gracefully (reorder only, no resize).
- [ ] Tablet editor supports 6 or 8 columns as appropriate, documented in design notes.
