# T11 — Drag/resize/remove widget controls

**Status**: Accepted
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

## Acceptance criteria

- [ ] Drag, resize, and remove states each have a dedicated frame or component variant.
- [ ] Undo snackbar copy and timing are documented.
- [ ] Keyboard equivalents are annotated for accessibility (links to T60).
