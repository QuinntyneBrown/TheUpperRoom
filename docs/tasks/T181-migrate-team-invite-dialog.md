# T181 — Migrate "Invite team member" dialog to DialogService

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #2)

## Problem

`projects/feature-team/src/lib/invite-dialog/invite-dialog.html:1` is itself a `<ur-dialog>` at the template root, but its sole consumer (`local-team-page.html:13`) renders it inline:

```html
@if (showInvite()) {
  <ur-invite-dialog (closed)="showInvite.set(false)" (invited)="onInvited()" />
}
```

No backdrop, no portal, no `inert` background.

## Update `docs/ui-design.pen`

- **Remove** any inline depiction of the invite dialog within the team page frame.
- **Add** `Dialog / Invite Team Member (Overlay)` extending the modal shell. Form fields: email + role checkboxes. Actions: `Cancel` + `Send invite`.

## Implement

1. `<ur-invite-dialog>` already encapsulates the form. Refactor it so:
   - The component template's root is no longer `<ur-dialog>` — it becomes the *content* projected into the modal shell (the `DialogService` opens it inside a `<ur-dialog>` overlay).
   - It declares `dialogRef = inject(UrDialogRef)` and calls `dialogRef.close()` on cancel and `dialogRef.close({ invited: true })` on success.
   - Drop the `closed`/`invited` outputs.
2. Replace the trigger in `local-team-page.ts`:
   ```ts
   onInviteClick() {
     this.dialog.open(InviteDialogComponent, { ariaLabel: 'Invite team member' })
       .closed$.subscribe(r => { if (r?.invited) this.loadTeam(); });
   }
   ```
3. Delete the `<ur-invite-dialog>` and `showInvite` signal from `local-team-page.html`/`.ts`.
4. Update specs: `feature-team/src/lib/local-team-page/*.spec.ts` and any e2e that asserts `data-testid="invite-dialog"` to query inside `.cdk-overlay-container`.

## Definition of done

- [ ] Invite flow opens in the overlay; backdrop dims the page; focus traps to the email input.
- [ ] Closing returns focus to the "+ Invite member" button.
- [ ] `<ur-invite-dialog>` no longer wraps itself in `<ur-dialog>` at its template root.
- [ ] Tests pass.
- [ ] `git commit -m "T181: migrate invite-dialog to DialogService overlay" && git push origin main`.
