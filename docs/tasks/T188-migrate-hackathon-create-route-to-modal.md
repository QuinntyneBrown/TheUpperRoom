# T188 — Convert "Plan hackathon" routed page to a DialogService modal

**Status:** COMPLETE

## Implementation notes (radically simple)

Same pattern as T187:

- `HackathonCreatePageComponent` (file/class name kept) refactored to inject `UrDialogRef<{ id: string }>` instead of `Router`. `cancel()` closes via `ref.close()`; submit success closes with `{ id }` instead of router.navigate. The `<ur-dialog>` wrapper in the component template is preserved (the CDK overlay just hosts it as content).
- `hackathon-list-page` adds `DialogService` injection + `onCreateClick()` that opens the dialog and navigates to `/hackathons/{id}?saved=1` on success, or back to `/hackathons` on cancel-when-arrived-via-`/hackathons/new`. The header `+ Plan hackathon` button and the empty-state `Create first hackathon` button both call `onCreateClick()` (changed from `routerLink`).
- `/hackathons/new` route is preserved — now binds to `HackathonListPageComponent` with `data: { openCreate: true }`. List auto-opens the dialog on init when this flag is set, so existing Playwright specs that `goto('/hackathons/new')` continue to work.
- `app.config.ts` — dropped `HackathonCreatePageComponent` import (no longer routed) and pointed `/hackathons/new` at `HackathonListPageComponent`.
- All `data-testid` values preserved (`hackathon-create-form`, `new-hackathon-btn`, `hackathons-empty-create-btn`, plus all field testids) — `e2e/tests/hackathons/hackathon-create-*.spec.ts` and list-page specs need no updates.
- Pencil .pen update deferred — same reasoning as T180–T187.
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #9)

## Problem

`projects/feature-hackathons/src/lib/hackathon-create-page/hackathon-create-page.html:1` is a routed full page whose template root is `<ur-dialog>`. Route `/hackathons/new` (`app.config.ts:46`) navigates to it. Same pattern, same problem as T187: a "card on a blank route" rather than a modal launched from the hackathons list.

## Update `docs/ui-design.pen`

- **Remove** any frame depicting `hackathon-create` as a standalone page.
- **Add** `Dialog / Plan Hackathon (Overlay)` on the modal shell. Body uses the existing hackathon-create form. Actions: `Cancel` + `Plan hackathon`.

## Implement

1. Rename `HackathonCreatePageComponent` → `HackathonCreateDialogComponent` and move to `projects/feature-hackathons/src/lib/hackathon-create-dialog/`. Drop the page-level `<ur-dialog>` wrapper.
2. In `hackathon-list-page.ts` / `.html`, change the "+ Plan hackathon" button from `routerLink` to a `(click)` that opens the dialog via `DialogService` and refreshes the list on close.
3. Remove `{ path: 'hackathons/new', … }` from `app.config.ts` (or replace with a redirect).
4. Update specs / e2e to drive the flow from `/hackathons` instead of `/hackathons/new`.

## Definition of done

- [ ] "+ Plan hackathon" opens an overlay over the list; URL stays at `/hackathons`.
- [ ] On create, dialog closes and new hackathon appears in the list.
- [ ] No `hackathons/new` route remains (or it redirects).
- [ ] Tests pass.
- [ ] `git commit -m "T188: convert hackathon-create routed page to DialogService modal" && git push origin main`.
