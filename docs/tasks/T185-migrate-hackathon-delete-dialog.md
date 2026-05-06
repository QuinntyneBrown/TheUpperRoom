# T185 — Migrate "Delete hackathon" confirm to DialogService

**Status:** ACCEPTED
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
