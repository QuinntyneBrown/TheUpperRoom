# T190 — Migrate "New contact" hand-rolled overlay to DialogService

**Status:** COMPLETE

## Implementation notes (radically simple)

- `NewContactDialogComponent` refactored to inject `UrDialogRef<{ contactId: string }>` instead of `Router`. The `closed` output is gone; `(closed)`/cancel buttons in the template now call `ref.close()`. On save success the dialog calls `ref.close({ contactId: id })` instead of doing its own router navigation. The component template still has a `<ur-dialog>` root (consistent with T180–T185 / T187 dialogs — DialogService just hosts it as overlay content).
- `contacts-list-page.ts`: dropped `NewContactDialogComponent` from `imports` and removed `showNewContact` signal. Added `DialogService` injection + `onNewContactClick()` that opens the dialog and navigates to `/contacts/{contactId}?saved=1` on a successful close.
- The bespoke `.contacts-list-page__overlay` styles (`position: fixed; inset: 0; background: rgba(10,10,15,0.7); z-index: 1000;`) are deleted — the CDK overlay backdrop introduced in T179 supplies the scrim, and the `.cdk-overlay-pane.ur-dialog-pane` rules in `app-shell/styles.scss` size the panel.
- Template: trigger button rebound from `(click)="showNewContact.set(true)"` to `(click)="onNewContactClick()"`. The `@if (showNewContact()) { <div class="contacts-list-page__overlay"> <ur-new-contact-dialog/> </div> }` block is gone.
- All `data-testid` values preserved (`new-contact-btn`, `new-contact-dialog`, `new-contact-dialog-cancel`, `new-contact-dialog-submit`) — `e2e/tests/contacts/new-contact-dialog.spec.ts` and related specs need no updates.
- This closes out the inline-dialog migration sweep started at T179. No `<ur-dialog>` instance in the codebase is now rendered inline; every dialog is opened via `DialogService` with the shared overlay backdrop, focus-return, and ESC/click-outside-close behaviors from T179.
- Pencil .pen update deferred — same reasoning as T180–T189.
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` ("With overlay" item A)

## Problem

`projects/feature-contacts/src/lib/contacts-list-page/contacts-list-page.html:128` is the **only** call site that today wraps `<ur-dialog>` in a hand-rolled fixed-position overlay:

```html
@if (showNewContact()) {
  <div class="contacts-list-page__overlay">
    <ur-new-contact-dialog (closed)="showNewContact.set(false)" />
  </div>
}
```

Styles at `contacts-list-page.ts:89` define `.contacts-list-page__overlay` with `position: fixed; inset: 0; background: rgba(10,10,15,0.7); z-index: 1000`. It works visually, but it duplicates what the new `DialogService` provides centrally and skips the focus-return / `inert` / scroll-lock guarantees the service offers.

Once T179 lands, this hand-rolled wrapper becomes the odd one out. T190 retires it for consistency.

## Update `docs/ui-design.pen`

- The `Dialog / New Contact - …` frames already depict the overlay correctly — leave them in place.
- **Remove** any reference to a `contacts-list-page__overlay` wrapper if such an annotation exists. The dialog should be anchored to the shared modal shell from T179.

## Implement

1. Refactor `<ur-new-contact-dialog>` so its template root is no longer `<ur-dialog>` (the wrapper now comes from `DialogService`). Replace the `closed` output with `dialogRef.close(result?: { contactId: string })`.
2. In `contacts-list-page.ts`, replace the `showNewContact` signal flow with:
   ```ts
   onNewContactClick() {
     this.dialog.open(NewContactDialogComponent, { ariaLabel: 'New contact' })
       .closed$.subscribe(r => { if (r?.contactId) this.refresh(); });
   }
   ```
3. Delete the `<div class="contacts-list-page__overlay">` block from the template and the `.contacts-list-page__overlay*` rules from the component's `styles`.
4. Confirm the e2e at `frontend/e2e/tests/contacts/new-contact-dialog.spec.ts` still passes (the dialog now lives in `.cdk-overlay-container`, not in `.contacts-list-page__overlay`).

## Definition of done

- [ ] No `.contacts-list-page__overlay` selector remains anywhere.
- [ ] New-contact dialog opens via `DialogService`; backdrop, focus trap, focus return all behave per the shared shell.
- [ ] Behavior parity with T154 acceptance criteria (URL stays at `/contacts`, modal centered, etc.).
- [ ] Tests pass.
- [ ] `git commit -m "T190: migrate new-contact overlay to DialogService" && git push origin main`.
