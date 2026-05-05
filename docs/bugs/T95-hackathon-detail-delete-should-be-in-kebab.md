# T95: Hackathon Detail header — explicit Delete button should be in kebab menu

**Status:** Fixed

## Description

The Hackathon Detail page header shows an explicit "Delete" button alongside "Edit". The design pattern (same as Partner Detail T93 and Contact Detail T91) requires delete to live inside a `more_horiz` kebab menu.

| Element | Design | Implementation |
|---|---|---|
| Right actions | Edit + `more_horiz` kebab | Edit + explicit Delete button |
| Delete placement | Inside kebab menu | Explicit header button |

## Affected Files

- `frontend/projects/feature-hackathons/src/lib/hackathon-detail-page/hackathon-detail-page.html`
  - Replace `<ur-button variant="danger" data-testid="hackathon-delete-btn">Delete</ur-button>` with `more_horiz` mat-icon-button (`data-testid="hackathon-more-btn"`)
  - Add "Delete hackathon" menu item (`data-testid="hackathon-delete-menu-item"`)
- `frontend/projects/feature-hackathons/src/lib/hackathon-detail-page/hackathon-detail-page.ts`
  - Add `MatMenuModule` to imports
- `frontend/e2e/pages/hackathons-page.ts`
  - Update `delete()` to use kebab flow
- `frontend/e2e/tests/hackathons/hackathon-delete-error.spec.ts`
  - Update to use kebab → delete menu item

## Fixed

- Replaced Delete button with `more_horiz` kebab (`data-testid="hackathon-more-btn"`) containing "Delete hackathon" menu item (`data-testid="hackathon-delete-menu-item"`)
- Added `MatMenuModule` to hackathon-detail-page.ts imports
- Updated POM `delete()` method and delete-error spec
