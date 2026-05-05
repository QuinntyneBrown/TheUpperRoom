# T157 — Dashboard empty state missing "Welcome, [name]" intro section

**Status:** Fixed ✓

## Description

The design for the empty dashboard state shows two sections:
1. **Intro** (top): "Welcome, Quinn" heading (`$fs-3xl`, `$fg-primary`) + descriptive subtitle
2. **Drop zone** (below): icon + "Drop widgets here to start" + CTA button + keyboard hint

The current implementation only renders the drop zone section. The personalized "Welcome, [name]" intro heading and subtitle are absent.

## Design (ui-design.pen)

Frame: `Desktop / Dashboard - Empty`, node `FLbwf` → `emptyContent (SkKC6)`

- `intro (mDth5)`:
  - "Welcome, Quinn" — `$fs-3xl`, `$fg-primary`, `$font-heading`, weight 600
  - "Your dashboard is empty. Add widgets to track partners, hackathons, and your local team." — `$fs-md`, `$fg-secondary`
- `dropZone (g92mGm)`:
  - 80×80 circle icon (`dashboard_customize`, `$accent-soft` bg, `$accent-primary` border)
  - "Drop widgets here to start"
  - description + CTA + keyboard hint

## Current Behaviour

Empty state shows only the drop zone content — no personalized welcome heading above it.

## Expected Behaviour

Above the drop zone, show "Welcome, [displayName]" heading and "Your dashboard is empty." subtitle.

## Failing Tests

`frontend/e2e/tests/dashboard/dashboard-empty-intro.spec.ts`
