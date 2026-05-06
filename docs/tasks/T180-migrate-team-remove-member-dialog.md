# T180 — Migrate "Remove team member" confirm to DialogService

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #1)

## Problem

`projects/feature-team/src/lib/local-team-page/local-team-page.html:58` renders the remove-member confirm inline:

```html
@if (removingMember()) {
  <ur-dialog title="Remove member" closeLabel="Cancel" (closed)="removingMember.set(null)" data-testid="remove-member-dialog">
    …
  </ur-dialog>
}
```

It paints inside `.team-page__content`, with no backdrop, and is reachable behind the (non-existent) modal scrim.

## Update `docs/ui-design.pen`

Open with Pencil MCP and:
- **Remove** any frame depicting the remove-member dialog as an inline panel within the team page layout.
- **Add** a frame `Dialog / Remove Team Member (Overlay)` anchored to the new `Dialog / Modal Shell (Overlay)` component from T179. Body copy: "Remove {Name} from the team? This cannot be undone." Actions: `Cancel` (ghost) + `Confirm remove` (danger).

## Implement

1. Extract the dialog body into a new component `projects/feature-team/src/lib/remove-member-dialog/remove-member-dialog.{ts,html,scss}`. It receives `member: TeamMember` via the dialog config `data` and emits `confirm` / closes with a boolean result via `UrDialogRef`.
2. In `local-team-page.ts`, replace the `removingMember` signal toggle with:
   ```ts
   private dialog = inject(DialogService);
   onRemoveClick(m: TeamMember) {
     this.dialog.open(RemoveMemberDialogComponent, { data: { member: m }, ariaLabel: 'Remove team member' })
       .closed$.subscribe(result => { if (result === true) this.confirmRemove(m); });
   }
   ```
3. Delete the inline `@if (removingMember()) { … }` block from `local-team-page.html` and the `removingMember`/`confirmRemove` plumbing that no longer applies.
4. Update the existing e2e test at `frontend/e2e/tests/team/remove-member*.spec.ts` (or wherever `data-testid="remove-member-dialog"` is asserted) to expect the dialog inside the CDK overlay container (`.cdk-overlay-container`).

## Definition of done

- [ ] Clicking "Remove" on a member opens an overlay-backed dialog with backdrop.
- [ ] Background is `inert`; ESC and backdrop click close (cancelling).
- [ ] Focus returns to the row's "Remove" button on close.
- [ ] No `<ur-dialog>` reference remains in `local-team-page.html`.
- [ ] All affected unit/e2e specs pass.
- [ ] `git commit -m "T180: migrate remove-member confirm to DialogService overlay" && git push origin main`.
