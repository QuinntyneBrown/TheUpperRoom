# T182 — Migrate "Delete contact" confirm to DialogService

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #3)

## Problem

`projects/feature-contacts/src/lib/contact-detail-page/contact-detail-page.html:42` renders the delete confirm inline inside the page header section:

```html
@if (showDeleteDialog()) {
  <ur-dialog title="Delete contact" subtitle="…" variant="danger" …>
    <ur-button variant="danger" … (click)="confirmDelete()">…</ur-button>
  </ur-dialog>
}
```

No backdrop; the dialog appears jammed under the page header.

## Update `docs/ui-design.pen`

- **Remove** any inline-on-detail-page rendering of the delete dialog.
- **Add** `Dialog / Delete Contact (Overlay)` (variant: danger) on the modal shell. Subtitle: "This contact will be removed. An admin can restore it later." Actions: `Cancel` + `Delete contact` (danger).

## Implement

1. Create `projects/feature-contacts/src/lib/delete-contact-dialog/delete-contact-dialog.{ts,html}`. Receives `data: { contact: Contact }`. Emits via `UrDialogRef.close(true)` on confirm; performs no service work itself (page does the delete).
2. In `contact-detail-page.ts`, replace the `showDeleteDialog` signal with:
   ```ts
   onDeleteClick() {
     this.dialog.open(DeleteContactDialogComponent, {
       data: { contact: this.contact()! },
       ariaLabel: 'Delete contact',
     }).closed$.subscribe(r => { if (r === true) this.confirmDelete(); });
   }
   ```
3. Remove `<ur-dialog>` block and `showDeleteDialog` signal from the template/component.
4. Update spec / e2e (`data-testid="contact-delete-dialog"` and `confirm-delete-contact-btn`) to query inside `.cdk-overlay-container`.

## Definition of done

- [ ] Delete confirm opens overlay with danger styling; backdrop dims page.
- [ ] ESC / Cancel close without deleting; Delete button performs the delete and the dialog closes itself.
- [ ] Focus returns to the kebab-menu "Delete" item.
- [ ] Tests pass.
- [ ] `git commit -m "T182: migrate delete-contact confirm to DialogService overlay" && git push origin main`.
