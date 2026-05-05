# 56 — Dark Theme Token System

**Traces to:** L2-042, L2-059. L1-010, L1-015.

Vertical slice: the SCSS token file and Angular Material override that every UI surface consumes. No light mode, no theme switcher.

## Status
Accepted

## Design update (2026-05-05)
The `components` library already has a complete `--ur-*` token system in `projects/components/src/lib/styles/_tokens.scss`, including `--mat-sys-*` → `--ur-*` mappings for Angular Material M3 overrides. Design aligns to that existing system rather than re-inventing different token names. Token colors updated to match `docs/ui-design.pen` exactly.

## Components

- `components/src/lib/styles/_tokens.scss` — defines `--ur-*` CSS custom properties and maps them to `--mat-sys-*` Material M3 tokens. Updated to match ui-design.pen values (accent-primary, fg-disabled, fg-muted).
- `app-shell/src/styles/tokens.scss` — applies the `_tokens.scss` host mixin to `:root`; adds chart-specific tokens not present in the components library (`--chart-grid`, `--chart-axis`, `--chart-series-1..6`, `--chart-tooltip-bg`).
- `app-shell/src/styles/theme.scss` — `@include mat.theme(...)` with `theme-type: dark`; the `--mat-sys-*` overrides from `tokens.scss` then dominate. No palette duplication outside this file.
- `app-shell/src/styles.scss` — imports theme, then tokens, then a body background rule.
- `angular.json` — adds `stylePreprocessorOptions.includePaths: ["projects"]` so libraries can `@use 'components/src/lib/styles/tokens'`.

## Acceptance tests (L2-042)

- Body element `background-color` computed value equals `--ur-bg-base` (#0a0a0f) after theme loads.
- All required chart tokens (`--chart-series-1` through `--chart-series-6`, grid, axis, tooltip) are defined in `tokens.scss`.
- Static scan finds zero `mat.define-palette()` calls or direct palette variable references outside `theme.scss`.

## Radical simplicity notes

- One token file, one theme file. Theme switcher is explicitly out of scope.
- Tokens are CSS custom properties so non-Material components (Chart.js, custom widgets) consume the same variables.
- No SCSS variables — only CSS custom properties for runtime flexibility.
