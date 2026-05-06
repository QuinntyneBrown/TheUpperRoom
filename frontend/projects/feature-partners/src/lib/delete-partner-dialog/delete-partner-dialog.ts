import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

export interface DeletePartnerDialogData {
  partnerName: string;
}

@Component({
  selector: 'ur-delete-partner-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      [title]="title"
      subtitle="This partner will be removed and contacts will be detached. An admin can restore it."
      variant="danger"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="partner-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-partner-btn">
        {{ confirmLabel }}
      </ur-button>
    </ur-dialog>
  `,
})
export class DeletePartnerDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
  private data = inject<DeletePartnerDialogData | null>(UR_DIALOG_DATA, { optional: true });

  get title(): string {
    return this.data?.partnerName ? `Delete ${this.data.partnerName}?` : 'Delete partner';
  }

  get confirmLabel(): string {
    return this.data?.partnerName ? `Delete ${this.data.partnerName}` : 'Delete partner';
  }
}
