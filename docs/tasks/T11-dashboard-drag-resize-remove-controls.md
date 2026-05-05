# T11 — Drag/resize/remove widget controls

**Status**: Complete
**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard
**Requirements**: L1-007, L2-033
**Source**: Screen-Level Missing Inventory — "Dashboard drag/resize/remove controls"

## Goal

Visually specify the per-widget controls used during edit mode and the in-progress states for each gesture.

## Scope

- Drag-in-progress state: ghosted source slot, drop-target highlight, snapping-to-grid indicator.
- Resize-in-progress state: handle on bottom-right corner, dimension tooltip.
- Remove control: trash/X icon with destructive hover and confirmation snackbar with Undo.
- Keyboard equivalents: arrow-key reposition, shift+arrow resize, delete key removes (annotated).

## Design notes

- **Drag in progress** (`Desktop / Dashboard - Drag In Progress`): the source slot is replaced by a 55%-opacity ghost frame with a dashed accent outline, the floating widget tilts -2° and gains a heavy shadow, and the candidate drop slot draws a 2 px solid accent border. A footer reads "Snap to 12-column grid · 4-row baseline".
- **Resize in progress** (`Desktop / Dashboard - Resize In Progress`): the resizing widget gains a dashed 2 px accent outline; a 40% accent ghost shows the original footprint. The bottom-right corner has a 24 × 24 accent handle, and a `dimTooltip` to its right shows live cell count and pixel size (e.g. `6 × 4 cells · ≈ 780 × 300 px`). Snapping happens in 1-cell increments.
- **Remove + Undo** (`Desktop / Dashboard - Remove + Undo Snackbar`): hovering the remove control turns the widget border red and the X button to filled `$danger`. After confirmation, the slot becomes a placeholder ("Slot freed") and a centered bottom snackbar appears with title "*Reminders* was removed", subtext "Undo within 8 seconds", and a primary `Undo` button. Snackbar auto-dismisses after **8 seconds**; until then the removal is reversible.
- **Keyboard equivalents** (cross-references T60 keyboard navigation):
  - **Arrow keys**: reposition the focused widget by one cell in the arrow's direction.
  - **Shift + Arrow**: resize the focused widget — right/down grows, left/up shrinks (minimum 1 × 1).
  - **Delete / Backspace**: removes the focused widget; the same Undo snackbar applies.
  - **Escape**: cancels an active drag/resize and reverts to the pre-gesture state.

## Acceptance criteria

- [x] Drag, resize, and remove states each have a dedicated frame or component variant.
- [x] Undo snackbar copy and timing are documented.
- [x] Keyboard equivalents are annotated for accessibility (links to T60).
