import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

@Component({
  selector: 'ur-delete-hackathon-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      title="Delete hackathon"
      subtitle="This hackathon will be removed. An admin can restore it later."
      variant="danger"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="hackathon-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-hackathon-btn">
        Delete hackathon
      </ur-button>
    </ur-dialog>
  `,
})
export class DeleteHackathonDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
}
