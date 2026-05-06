import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

@Component({
  selector: 'ur-delete-partner-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      title="Delete partner"
      subtitle="This partner will be removed and contacts will be detached. An admin can restore it."
      variant="danger"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="partner-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-partner-btn">
        Delete partner
      </ur-button>
    </ur-dialog>
  `,
})
export class DeletePartnerDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
}
