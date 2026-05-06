# T188 — Convert "Plan hackathon" routed page to a DialogService modal

**Status:** ACCEPTED
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
