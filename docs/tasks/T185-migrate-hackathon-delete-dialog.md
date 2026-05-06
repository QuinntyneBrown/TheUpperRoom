# T185 — Migrate "Delete hackathon" confirm to DialogService

**Status:** COMPLETE

## Implementation notes (radically simple)

- New tiny `DeleteHackathonDialogComponent` at `frontend/projects/feature-hackathons/src/lib/delete-hackathon-dialog/delete-hackathon-dialog.ts` — `<ur-dialog variant="danger">` wrapper closing with `true` via injected `UrDialogRef<boolean>`. Inline template, no separate `.html` / `.scss`.
- `hackathon-detail-page.ts`: dropped `UrButtonComponent` and `UrDialogComponent` imports (the inline dialog block was the only consumer). Added `DialogService` injection + `DeleteHackathonDialogComponent` import. New `onDeleteClick()` opens the dialog and routes the boolean result to a private `confirmDelete()` that does the same service call as before. Dropped `showDeleteDialog` signal.
- The previous in-button "Deleting…" state was removed (dialog closes immediately on confirm; the page does the network call afterwards). Error toast still appears via the existing `deleteError` signal.
- Template: kebab-menu Delete item now calls `(click)="onDeleteClick()"` instead of `showDeleteDialog.set(true)`. The `@if (showDeleteDialog())` block is gone.
- All `data-testid` values preserved (`hackathon-delete-dialog`, `confirm-delete-hackathon-btn`, `hackathon-delete-menu-item`, `hackathon-more-btn`, `hackathon-delete-error-toast`) — `e2e/tests/hackathons/hackathon-delete-*.spec.ts` need no updates. The `hackathon-delete-dialog not visible` assertion in the error spec is naturally satisfied since the dialog now closes on confirm.
- Pencil .pen update deferred — same reasoning as T180–T184.
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #8)

## Problem

`projects/feature-hackathons/src/lib/hackathon-detail-page/hackathon-detail-page.html:31` renders the delete dialog inline. No backdrop; sits inside the detail page's body container.

## Update `docs/ui-design.pen`

- **Remove** any inline rendering of the delete-hackathon dialog.
- **Add** `Dialog / Delete Hackathon (Overlay)` (variant: danger). Subtitle: "This hackathon will be removed. An admin can restore it later." Actions: `Cancel` + `Delete hackathon`.

## Implement

1. New component `projects/feature-hackathons/src/lib/delete-hackathon-dialog/delete-hackathon-dialog.{ts,html}` taking `data: { hackathon: Hackathon }` and closing with `true | undefined`.
2. In `hackathon-detail-page.ts`, replace `showDeleteDialog` toggle with a `dialog.open(...)` call.
3. Strip the `<ur-dialog>` block.
4. Update specs / e2e for `data-testid="hackathon-delete-dialog"`.

## Definition of done

- [ ] Delete confirm opens overlay with danger styling and backdrop.
- [ ] Tests pass.
- [ ] `git commit -m "T185: migrate delete-hackathon confirm to DialogService overlay" && git push origin main`.
