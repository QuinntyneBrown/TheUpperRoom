# T97: Contacts list — "New contact" button should be "+ New contact"

**Status:** Fixed

## Description

The primary action button on the Contacts list page reads "New contact" but the design shows "+ New contact".

| Element | Design | Implementation |
|---|---|---|
| Header CTA | `+ New contact` | `New contact` |

Design reference: `docs/ui-design.pen` → contacts list top-bar, node `Xfl4P` content: `+ New contact`

## Affected Files

- `frontend/projects/feature-contacts/src/lib/contacts-list-page/contacts-list-page.html`
  - Change button text from `New contact` to `+ New contact`

## Fixed

- Changed `<a mat-raised-button>New contact</a>` → `+ New contact`
