import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

export interface DeleteContactDialogData {
  contactName: string;
}

@Component({
  selector: 'ur-delete-contact-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      [title]="title"
      subtitle="This contact will be removed. An admin can restore it later."
      variant="danger"
      icon="delete"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="contact-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-contact-btn">
        {{ confirmLabel }}
      </ur-button>
    </ur-dialog>
  `,
})
export class DeleteContactDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
  private data = inject<DeleteContactDialogData | null>(UR_DIALOG_DATA, { optional: true });

  get title(): string {
    return this.data?.contactName ? `Delete ${this.data.contactName}?` : 'Delete contact';
  }

  get confirmLabel(): string {
    return this.data?.contactName ? `Delete ${this.data.contactName}` : 'Delete contact';
  }
}
