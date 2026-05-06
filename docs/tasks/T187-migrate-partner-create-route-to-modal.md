# T187 — Convert "New partner" routed page to a DialogService modal

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #7)

## Problem

`projects/feature-partners/src/lib/partner-create-page/partner-create-page.html:1` is a routed full page whose template root is `<ur-dialog>`. Route `/partners/new` (`app.config.ts:51`) navigates to it, so the user lands on a card on a blank route — visually it reads as a card, not a modal over the partners list. No overlay, no backdrop, no list-page context behind it.

This mirrors the resolution applied to "New contact" in `docs/bugs/T154-new-contact-should-open-as-modal-not-navigate.md` — the design intent is a modal launched from the partners list while the user stays at `/partners`.

## Update `docs/ui-design.pen`

- **Remove** any frame depicting `partner-create` as a standalone page.
- **Add** `Dialog / New Partner (Overlay)` on the modal shell. Body uses the existing partner-create form. Actions: `Cancel` + `Create partner`.
- Confirm the partners list frame shows the dialog overlaid on the list (consistent with `Dialog / New Contact - …`).

## Implement

1. Rename `PartnerCreatePageComponent` → `PartnerCreateDialogComponent` and move the file to `projects/feature-partners/src/lib/partner-create-dialog/`. Drop the page-level `<ur-dialog>` wrapper from the template — the form becomes the projected content.
2. In `partner-list-page.ts` / `partner-list-page.html`, change the "+ New partner" button from a `routerLink="/partners/new"` to `(click)="onCreateClick()"`. The handler opens `PartnerCreateDialogComponent` via `DialogService` and refreshes the list on a successful close.
3. Remove the `{ path: 'partners/new', … }` route from `app.config.ts`.
4. Add a redirect `partners/new → partners` (with a query param if needed) so any bookmarked URL still lands somewhere sane and optionally auto-opens the dialog.
5. Update specs / e2e: anything that drove `goto('/partners/new')` should now click the button on `/partners` and assert the dialog within `.cdk-overlay-container`.

## Definition of done

- [ ] "+ New partner" opens an overlay over the list page; URL stays at `/partners` (or `/partners?new=1`).
- [ ] On create, dialog closes and the new partner appears in the list.
- [ ] Existing partner-create form validation behavior is preserved.
- [ ] No `partners/new` route remains (or it redirects).
- [ ] Tests pass.
- [ ] `git commit -m "T187: convert partner-create routed page to DialogService modal" && git push origin main`.
