# T93: Partner Detail header — missing back arrow icon, "+ Add note" button, and Delete in kebab menu

**Status:** Fixed

## Description

The Partner Detail page header does not match the design:

| Element | Design | Implementation |
|---|---|---|
| Breadcrumb left | `arrow_back` icon + "Partners / {name}" | "Partners / {name}" (no icon) |
| Right actions | Edit + "+ Add note" | Edit + explicit Delete button |
| Delete placement | Not in header — should be in kebab menu | Explicit header button |

Design reference: `docs/ui-design.pen` → "Desktop / Partner Detail" (node `g9pKsq`)
- Top bar `pdtop` (`ECFIP`):
  - Left (`zif5R`): `arrow_back` icon (`NqqhY`) + "Partners" link + "/" + partner name
  - Right (`CZvFV`): "Edit" button (`nz4YN`) + "+ Add note" button (`g8QeB`)
- No explicit Delete button in the top bar

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html`
  - Add `arrow_back` mat-icon to breadcrumb
  - Replace Delete button with `more_horiz` mat-icon-button (kebab menu) `data-testid="partner-more-btn"`
  - Add "Delete partner" menu item `data-testid="partner-delete-menu-item"`
  - Add `data-testid="partner-add-note-btn"` button for "+ Add note" that focuses the notes textarea
- `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.ts`
  - Add `MatMenuModule` to imports
  - Add `scrollToNotes()` method

## Fixed

- Added `arrow_back` mat-icon to breadcrumb with `data-testid="partner-breadcrumb-back-arrow"`
- Added `data-testid="partner-breadcrumb-link"` to Partners breadcrumb link
- Added `data-testid="partner-add-note-btn"` "+ Add note" button in header right side
- Replaced Delete button with `more_horiz` kebab (`data-testid="partner-more-btn"`) containing "Delete partner" menu item (`data-testid="partner-delete-menu-item"`)
- Added `MatMenuModule` to imports and `scrollToNotes()` method
- Added breadcrumb/header CSS styles to component
- Updated `partners-page.ts` POM `delete()` method to use kebab flow
- Updated `partner-delete-error.spec.ts` to use kebab → delete menu item
