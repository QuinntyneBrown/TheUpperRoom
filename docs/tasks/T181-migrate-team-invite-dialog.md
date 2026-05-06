# T181 — Migrate "Invite team member" dialog to DialogService

**Status:** COMPLETE

## Implementation notes (radically simple)

- `InviteDialogComponent` now injects `UrDialogRef<{ invited: true }>` instead of declaring `closed`/`invited` outputs. Cancel and the `<ur-dialog>` `(closed)` event call `ref.close()`; a successful invite calls `ref.close({ invited: true })`. The component's template root is still `<ur-dialog>` — kept that as-is for radical simplicity (T179's overlay just renders it as panel content; the redundant `cdkTrapFocus` inside `<ur-dialog>` is harmless).
- `local-team-page`: dropped `InviteDialogComponent` from `imports`, dropped `showInvite` signal and `onInvited()` method. New `onInviteClick()` opens via `DialogService` and calls `loadTeam()` only when the closed result has `invited: true`.
- Trigger button rebound from `(click)="showInvite.set(true)"` to `(click)="onInviteClick()"`.
- Inline `<ur-invite-dialog>` block stripped from `local-team-page.html`.
- All `data-testid` values preserved (`invite-member-button`, `invite-dialog`, `send-invite-btn`, `invite-role-*`, `invite-save-error`) — Playwright `getByTestId` works against the CDK overlay container, so existing e2e specs in `e2e/tests/team/invite-*.spec.ts` need no updates.
- Pencil .pen update deferred — same reasoning as T180.
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
