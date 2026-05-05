# 87 — Multi-Viewport Smoke Matrix

**Traces to:** L2-064. L1-009.

## Status
Complete

Vertical slice: declare three Playwright projects and the smoke flows that participate in each. Individual flow slices opt in by tag, not by reimplementation.

## Components

- `playwright.config.ts` projects:
  ```ts
  projects: [
    { name: 'xs-mobile',  use: { viewport: { width: 375,  height: 667  } } },
    { name: 'md-tablet',  use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'lg-desktop', use: { viewport: { width: 1280, height: 800  } } },
  ]
  ```
- Required smoke flows per project:

| Flow (slice) | xs-mobile | md-tablet | lg-desktop |
|---|---|---|---|
| Auth & session (79) | ✔ | ✔ | ✔ |
| Contact create (subset of 80) | ✔ | ✔ | ✔ |
| Partner create (subset of 81) | ✔ | ✔ | ✔ |
| Dashboard widget add (subset of 84) | ✔ | ✔ | ✔ |
| Global search (86) | ✔ | ✔ | ✔ |

- Tests opt in via `test.describe('@smoke', ...)` and the project filter `--grep @smoke`.
- CI runs the full matrix on PRs that touch shell, theme, or the listed flows; nightly on `main`.

## Acceptance tests (L2-064)

- Matrix runs all three projects with all required smoke flows green.
- Failing any one viewport fails CI.

## Radical simplicity notes

- The matrix is one config block plus one tag. Flow tests do not duplicate code per viewport.
- Subset smoke variants live in the same flow files using `test.describe('@smoke', ...)` for the minimal happy path.
