import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

@Component({
  selector: 'ur-delete-contact-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      title="Delete contact"
      subtitle="This contact will be removed. An admin can restore it later."
      variant="danger"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="contact-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-contact-btn">
        Delete contact
      </ur-button>
    </ur-dialog>
  `,
})
export class DeleteContactDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
}
