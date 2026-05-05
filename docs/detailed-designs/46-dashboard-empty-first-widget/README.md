# 46 — Dashboard Empty State and First Widget

**Traces to:** L2-032. L1-007.

Vertical slice: a brand-new user lands on the dashboard, sees the empty state, and adds their first widget. Drag/resize/persistence and catalog logic live in slices 47–49.

## Components

- Backend `GET /api/dashboards/me` (from slice 30) returns `{ json: '{"items":[]}' }` if no row exists.
- Frontend `feature-dashboard/dashboard-page` route `/dashboard`. When `items.length === 0`, renders the empty state with a single "Add widget" CTA.
- Frontend "Add widget" CTA opens the catalog dialog (slice 47); selecting the first widget appends it at `(0,0)` with the widget's default size and immediately calls `PUT /api/dashboards/me`.

## Acceptance tests (L2-032)

- New user opens `/dashboard` → empty state and "Add widget" CTA visible.
- Click "Add widget" → catalog opens, choose any widget → widget appears, layout is persisted.
- Sign out and sign back in → the same single widget is restored at `(0,0)`.

## Radical simplicity notes

- Empty state is one Angular `*ngIf="items.length === 0"`. No separate component.
- Default insertion position is hardcoded `(0,0)`; collision avoidance only matters once there are multiple widgets (slice 47/48).
