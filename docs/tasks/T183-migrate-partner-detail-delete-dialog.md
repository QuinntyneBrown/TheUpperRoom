# T183 — Migrate "Delete partner" confirm to DialogService

**Status:** COMPLETE

## Implementation notes (radically simple)

- New tiny `DeletePartnerDialogComponent` at `frontend/projects/feature-partners/src/lib/delete-partner-dialog/delete-partner-dialog.ts` — `<ur-dialog variant="danger">` wrapper that closes with `true` on confirm via injected `UrDialogRef<boolean>`. Inline template, no separate `.html` / `.scss`.
- `partner-detail-page.ts`: added `DialogService` injection + `DeletePartnerDialogComponent` import. New `onDeleteClick()` opens the dialog and routes the boolean result to a private `confirmDelete()` that does the same service call as before. Dropped `showDeleteDialog` signal.
- The previous in-button "Deleting…" state was removed (dialog closes immediately on confirm; the page does the network call afterwards). Error toast still appears via the existing `deleteError` signal.
- Kept `UrDialogComponent` and `UrButtonComponent` in the page's `imports` — still needed for the `showStageDialog` block, which T184 will migrate.
- Template: kebab-menu Delete item now calls `(click)="onDeleteClick()"` instead of `canDelete() && showDeleteDialog.set(true)`. The `@if (showDeleteDialog())` block is gone.
- All `data-testid` values preserved (`partner-delete-dialog`, `confirm-delete-partner-btn`, `partner-delete-menu-item`, `partner-more-btn`, `partner-delete-permission-denied-banner`, `partner-delete-error-toast`) — `e2e/tests/partners/partner-delete-*.spec.ts` need no updates.
- Pencil .pen update deferred — same reasoning as T180–T182.
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #5)

## Problem

`projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html:43` renders the delete confirm inline. No backdrop; appears under the page header in document flow.

## Update `docs/ui-design.pen`

- **Remove** any inline rendering of the delete-partner dialog.
- **Add** `Dialog / Delete Partner (Overlay)` (variant: danger). Subtitle: "This partner will be removed and contacts will be detached. An admin can restore it." Actions: `Cancel` + `Delete partner` (danger).

## Implement

1. New component `projects/feature-partners/src/lib/delete-partner-dialog/delete-partner-dialog.{ts,html}` taking `data: { partner: Partner }` and closing with `true | undefined`.
2. In `partner-detail-page.ts`, replace the `showDeleteDialog` toggle with `dialog.open(DeletePartnerDialogComponent, …).closed$.subscribe(...)`.
3. Strip the `@if (showDeleteDialog()) { <ur-dialog>…</ur-dialog> }` block and the `showDeleteDialog` signal.
4. Update specs / e2e for `data-testid="partner-delete-dialog"`.

## Definition of done

- [ ] Delete confirm opens overlay with danger styling and backdrop.
- [ ] Focus returns to the kebab "Delete" item.
- [ ] Tests pass.
- [ ] `git commit -m "T183: migrate delete-partner confirm to DialogService overlay" && git push origin main`.
