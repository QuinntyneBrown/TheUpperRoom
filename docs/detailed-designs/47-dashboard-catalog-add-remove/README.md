# 47 — Dashboard Widget Catalog Add/Remove

**Traces to:** L2-033 (catalog and remove portion). L1-007.

Vertical slice: catalog dialog adds widgets and the per-widget overflow menu removes them. Drag/resize is slice 48.

## Components

- Frontend `feature-dashboard/widget-catalog-dialog` — Material dialog listing the static widget catalog: `kpi`, `line-chart`. One row per widget with title, description, "Add" button.
- Frontend dashboard page passes selected widget type to a small `addWidget(type)` helper that appends `{ id: uuid, type, x: 0, y: 0, cols: 4, rows: 3, config: {} }` (defaults per type).
- Frontend each rendered widget has an overflow menu with "Remove" → splices the item from `items` and calls `PUT /api/dashboards/me`.
- Frontend persists every mutation by calling the existing `DASHBOARD_SERVICE.save(json)`.

## Catalog (initial)

| Type | Default cols × rows | Config |
|---|---|---|
| `kpi` | 2×2 | `{ metric: 'contacts.total' }` |
| `line-chart` | 4×3 | `{ metric: 'contacts.created', range: '7d' }` |

## Acceptance tests (L2-033)

- Add `kpi` then `line-chart` → both render and persist; reload restores them.
- Remove a widget → it disappears and is absent on reload.
- The catalog list is the only place to discover available widget types.

## Radical simplicity notes

- Catalog is a static TypeScript array. Adding a new widget is one PR with a new entry.
- Remove uses `Array.splice` + save; no per-widget delete API.
- Default size and config are properties of the catalog entry — no separate widget factory.
