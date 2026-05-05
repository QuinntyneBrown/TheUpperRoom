# T22 — Partner board responsive variants

**Status**: Complete
**Phase**: 3 — Responsive coverage and clipping fixes
**Area**: Partner, Responsive
**Requirements**: L1-004, L1-009, L2-021, L2-039, L2-040, L2-041
**Source**: Screen-Level Missing Inventory — "Mobile/tablet ... partner board"

## Goal

Provide responsive variants of the Kanban-style partner board built in T36.

## Scope

- Mobile: collapsed accordion or horizontal pager with stage section headers.
- Tablet: three-column board at ≥768px.
- Desktop: full Kanban (covered by T36).
- Empty per-stage state, drag-and-drop touch interaction notes.

## Design notes

- **Mobile (≤ 767 px)** — accordion of stage sections; only one section open at a time by default. Each section header shows the stage name, count badge, and chevron-down/-right indicating expanded/collapsed state. Cards inside are full-width rows (name, primary contact + city) with chevron-right to drill into the partner detail.
- **Stage transitions on touch (`Mobile / Partner Board - Move Stage Sheet`)** — long-press a partner row for 250 ms to invoke the move sheet. Sheet lists every stage with its accent dot color, marks the current stage as disabled, and the destination as `$accent-primary` selected. A divider separates `Archive partner` (destructive) at the bottom. Tap to commit; sheet closes immediately and an undo snackbar appears (reuses T11 pattern).
- **Empty stage (`Mobile / Partner Board - Empty Stage`)** — when an open accordion section contains no partners, a centered placeholder shows a folder icon, "No partners ___ yet", and a one-line hint to long-press a partner in another stage.
- **Tablet (768—1199 px)** — three-column board (Discovery / Aligning / Hosting) with a fourth column reachable by horizontal scroll if the workspace defines more stages. The active drop column is highlighted with a dashed accent border and a "Drop here" ghost slot, mirroring T11 desktop drag affordances. Cards remain compact (60—80 px tall) so 4—6 fit per column.
- **Desktop (≥ 1200 px)** — full Kanban built in T36 (out of scope for T22).

## Acceptance criteria

- [x] Mobile and tablet partner board variants exist.
- [x] Stage transitions on touch are described (long-press + move-to menu, or drag).
- [x] Empty-stage state designed.
