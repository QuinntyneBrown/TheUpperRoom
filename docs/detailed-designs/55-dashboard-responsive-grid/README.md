# 55 — Dashboard Responsive Grid

**Traces to:** L2-041, L2-033. L1-009, L1-007.

Vertical slice: dashboard-specific grid column counts and widget sizing constraints, separated from the general shell.

## Status
Accepted

## Design update (2026-05-05)
Angular Gridster2 is not compatible with Angular 21. Implemented using CSS Grid + `BreakpointObserver` directly in app-shell. The radical simplicity note "No responsive grid framework" is taken literally — CSS Grid with a 4-entry column-count switch.

## Components

- `app-shell/src/app/dashboard/dashboard-page.ts` — a `DashboardPageComponent` that:
  - Uses `BreakpointObserver` (same pattern as the shell) for four breakpoints: xs/sm/md/lg+.
  - Computes `cols` signal: xs=1, sm=2, md=6, lg+=12.
  - Renders a grid container with `[attr.data-cols]="cols()"` for testability.
  - CSS Grid layout with `repeat(var(--ur-dashboard-cols), 1fr)`.
- Widget slots are `<ng-content>` projected items.

## Acceptance tests

- L2-041: at `1280x800`, `[data-cols="12"]` is visible.
- L2-033 mobile: at `375x667`, `[data-cols="1"]` is visible.

## Radical simplicity notes

- Column counts are a four-entry switch. No responsive grid framework.
- `data-cols` attribute makes column count directly testable without CSS inspection.
