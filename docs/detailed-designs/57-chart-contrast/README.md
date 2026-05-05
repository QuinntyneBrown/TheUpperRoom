# 57 — Chart and Non-Text Contrast Validation

**Traces to:** L2-042, L2-059. L1-015.

Vertical slice: ensure chart series, focus rings, error states, and meaningful icons meet 3:1 non-text contrast.

## Components

- Frontend `feature-dashboard/line-chart-widget` (and any other Chart.js use) reads colors only from `--chart-*` tokens.
- Test `tests/contrast/chart-contrast.spec.ts` — for each series-vs-grid and series-vs-tooltip pair, computes WCAG contrast and asserts ≥3:1.
- Test `tests/contrast/non-text.spec.ts` — for `--focus-ring` vs every surface, `--status-error` icon vs every surface, and meaningful icon foreground vs background, asserts ≥3:1.

## Acceptance tests (L2-059)

- Chart contrast test passes for all six series colors against the chart background and against each adjacent series.
- Focus ring contrast ≥3:1 against every surface token.
- Error icon contrast ≥3:1 against every surface token.

## Radical simplicity notes

- Tests run against tokens, not rendered pixels. Token math is fast and deterministic.
- Decorative icons are exempt; the test only inspects icons marked `aria-hidden="false"` or with an `aria-label`.
