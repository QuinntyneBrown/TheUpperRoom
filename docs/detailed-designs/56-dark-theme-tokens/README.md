# 56 — Dark Theme Token System

**Traces to:** L2-042, L2-059. L1-010, L1-015.

Vertical slice: the SCSS token file and Angular Material override that every UI surface consumes. No light mode, no theme switcher.

## Components

- Frontend `app-shell/styles/tokens.scss` — exports SCSS variables and CSS custom properties for:
  - Backgrounds (`--bg-0`, `--bg-1`, `--bg-2`).
  - Text (`--text-primary`, `--text-secondary`, `--text-disabled`).
  - Status (`--status-success`, `--status-warning`, `--status-error`, `--status-info`).
  - Focus (`--focus-ring`).
  - Charts (`--chart-grid`, `--chart-axis`, `--chart-series-1..6`, `--chart-tooltip-bg`).
- Frontend `app-shell/styles/theme.scss` — `@include mat.all-component-themes($dark-theme)` driven entirely by tokens.
- Lint rule blocks `@import '@angular/material/.*-theme'` and `mat.define-palette()` outside `theme.scss`.
- Snapshot test renders one button, one card, one form field, one dialog and asserts computed background/text values match tokens.

## Acceptance tests (L2-042)

- Snapshot test of representative Material components passes.
- All body text resolves to ≥4.5:1 contrast; large text ≥3:1.
- Background luminance ≤ 20% on every surface token.
- Static scan finds zero direct Material palette imports outside `theme.scss`.

## Radical simplicity notes

- One token file, one theme file. Theme switcher is explicitly out of scope.
- Tokens are CSS custom properties so non-Material components (Chart.js, custom widgets) consume the same variables.
