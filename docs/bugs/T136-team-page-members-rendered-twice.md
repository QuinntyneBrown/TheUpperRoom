# T136 — Team page: members rendered twice (table and card view both always visible)

**Status**: Fixed ✓

## Description

`local-team-page.html` has two separate member rendering blocks:
1. `<table class="team-table">` — desktop table layout
2. `<div class="team-cards">` — mobile card layout

Both blocks render unconditionally. Without responsive CSS to toggle between them, all members appear twice on every viewport size.

## Fix

Add CSS to `local-team-page.ts` styles:
- Hide `.team-cards` at desktop widths (≥768px)
- Hide `.team-table` at mobile widths (<768px)
- Add basic table CSS (width, border-collapse, cell padding, column headers)

## References

- Route: `/team`
- Component: `frontend/projects/feature-team/src/lib/local-team-page/local-team-page.ts`
- Template: `frontend/projects/feature-team/src/lib/local-team-page/local-team-page.html`
