# 55 — Dashboard Responsive Grid

**Traces to:** L2-041, L2-033. L1-009, L1-007.

Vertical slice: dashboard-specific grid column counts and widget sizing constraints, separated from the general shell.

## Components

- Frontend `feature-dashboard/dashboard-page` configures `<gridster>` with `gridType: 'fit'` and column counts driven by `viewport$`:
  - `xs`: 1 column.
  - `sm`: 2 columns.
  - `md`: 6 columns.
  - `lg+`: 12 columns.
- Each catalog widget declares `minCols`, `minRows`, `maxCols`, `maxRows`. Widgets exceeding the current viewport's column count are clamped to that count.

## Acceptance tests

- L2-041: at `1280x800`, the gridster reports `12` columns; resizing a widget can span up to 12.
- L2-033 mobile: at `375x667`, all widgets render in a single column stacked vertically; resize is disabled.

## Radical simplicity notes

- Column counts are a four-entry switch. No responsive grid framework.
- Resize is automatically disabled on `xs` because `cols=1` and `maxCols=1` collapse the grip.
