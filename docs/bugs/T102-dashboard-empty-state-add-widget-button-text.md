# T102: Dashboard empty state — "Add widget" should be "+ Add widget"

**Status:** Fixed

## Description

The empty state CTA on the Dashboard page reads "Add widget" but the design shows "+ Add widget".

| Element | Design | Implementation |
|---|---|---|
| Empty state CTA | `+ Add widget` | `Add widget` |

Design reference: `docs/ui-design.pen` → Desktop / Dashboard - Empty → dropZone → `bAH6K` / `Xfl4P` content: `+ Add widget`

## Affected Files

- `frontend/projects/feature-dashboard/src/lib/dashboard-page/dashboard-page.html` line 27
  - Change button text from `Add widget` to `+ Add widget`
