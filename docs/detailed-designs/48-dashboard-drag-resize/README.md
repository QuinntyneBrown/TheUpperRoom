# 48 — Dashboard Drag and Resize Persistence

**Traces to:** L2-033 (drag/resize portion). L1-007.

Vertical slice: gridster drag/resize updates the layout JSON and saves with debounce.

## Components

- Frontend `<gridster>` from `angular-gridster2` configured with `draggable.enabled = true`, `resizable.enabled = true`, `swap = true`, `pushItems = true`.
- Frontend `gridster.itemChange` handler updates the matching `items[i]` (`x, y, cols, rows`) and pushes the new layout into a debounced (300 ms) save call.
- Frontend save uses the existing `DASHBOARD_SERVICE.save(json)` from slice 30.

## Acceptance tests (L2-033)

- Drag a widget to a new cell → on drop, layout JSON contains the new `x,y` and the API receives `PUT /api/dashboards/me` within 300 ms idle.
- Resize a widget by 1 column → on release, `cols` updates and persists.
- Two rapid drags within 300 ms → exactly one PUT is fired with the final coordinates.

## Radical simplicity notes

- One subscription, one debounce. No save queue, no diff calculation.
- Swap and push behaviors are gridster's defaults; we don't reimplement collision logic.
- Gridster options live in one component constant; no settings page.
