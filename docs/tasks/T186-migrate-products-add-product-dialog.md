# T186 — Migrate "Add product" dialog to DialogService

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #10)

## Problem

`projects/feature-hackathons/src/lib/products-section/products-section.html:34` renders the add-product form dialog inline at the bottom of the section. No backdrop; the form paints below the products list rather than over it.

## Update `docs/ui-design.pen`

- **Remove** any inline-in-section rendering of the add-product form.
- **Add** `Dialog / Add Product (Overlay)` on the modal shell. Fields: name, description (optional), repo URL, demo URL. Actions: `Cancel` + `Add product`.

## Implement

1. Extract the form into a new component `projects/feature-hackathons/src/lib/add-product-dialog/add-product-dialog.{ts,html}`. Receives `data: { hackathonId: string }`. On submit it performs the create and closes with the new product so the section can prepend it.
2. In `products-section.ts`, replace `showForm`, `openForm`, `cancelForm`, `submit`, and the form-state signals with a single `onAddClick()` that opens the dialog and pushes the resulting product into `products()` on close.
3. Strip the `@if (showForm()) { <ur-dialog>…</ur-dialog> }` block.
4. Update specs / e2e for `data-testid="add-product-dialog"`, `add-product-btn`, `submit-product-btn`.

## Definition of done

- [ ] Clicking "+ Add product" opens the overlay; backdrop dims the page.
- [ ] On save, dialog closes and the new product appears at the top of the list.
- [ ] Focus returns to the "+ Add product" button.
- [ ] Tests pass.
- [ ] `git commit -m "T186: migrate add-product dialog to DialogService overlay" && git push origin main`.
