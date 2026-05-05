# T91: Contact Detail — missing breadcrumb and explicit Delete button (should be kebab menu)

**Status:** Fixed

## Description

The Contact Detail page header does not match the design:

| Element | Design | Implementation |
|---|---|---|
| Top-left | "← Contacts / {name}" breadcrumb | H1 with contact name only |
| Top-right actions | Edit button + `more_horiz` kebab icon | Edit button + explicit Delete button |

Design reference: `docs/ui-design.pen` → "Desktop / Contact Detail" (node `FBydC`)
- `htop` frame (`kXF2g`): top bar with breadcrumb left, actions right
- Left: back arrow icon + "Contacts / Sarah Mensah" text (`t03FtY`, `jZqXf`)
- Right: Edit button (`F6zdx`) + `more_horiz` icon button (`r94zCR`)
- Delete action belongs in the kebab menu (not as an explicit header button)

## Affected Files

- `frontend/projects/feature-contacts/src/lib/contact-detail-page/contact-detail-page.html`
  - Remove `<ur-button variant="danger" ... contact-delete-btn>Delete</ur-button>` from header
  - Add `data-testid="contact-breadcrumb-link"` link (← Contacts) to header top-left
  - Add contact name next to breadcrumb as non-link text
  - Add `data-testid="contact-more-btn"` mat-icon-button with `more_horiz` icon
  - Add mat-menu with `data-testid="contact-delete-menu-item"` for Delete option
- `frontend/projects/feature-contacts/src/lib/contact-detail-page/contact-detail-page.ts`
  - Add `MatMenuModule` to imports
- `frontend/e2e/tests/contacts/contact-delete-dialog.spec.ts`
  - Update to open kebab menu before clicking delete

## Fixed

- Added `← Contacts / {name}` breadcrumb row to header with `data-testid="contact-breadcrumb-link"` (link) and `data-testid="contact-breadcrumb-name"` (text)
- Replaced explicit Delete button with `mat-icon-button` (`data-testid="contact-more-btn"`) opening a `mat-menu`
- Delete option moved into menu with `data-testid="contact-delete-menu-item"`
- Added `MatMenuModule` to component imports
- Added breadcrumb CSS styles to component
- Updated `contact-delete-dialog.spec.ts` to click kebab → delete menu item
