import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

export interface DeleteHackathonDialogData {
  hackathonName: string;
}

@Component({
  selector: 'ur-delete-hackathon-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      [title]="title"
      subtitle="This hackathon will be removed. An admin can restore it later."
      titleTestId="hackathon-delete-dialog-title"
      subtitleTestId="hackathon-delete-dialog-subtitle"
      variant="danger"
      icon="delete"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="hackathon-delete-dialog"
    >
      <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-delete-hackathon-btn">
        {{ confirmLabel }}
      </ur-button>
    </ur-dialog>
  `,
})
export class DeleteHackathonDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
  private data = inject<DeleteHackathonDialogData | null>(UR_DIALOG_DATA, { optional: true });

  get title(): string {
    return this.data?.hackathonName ? `Delete ${this.data.hackathonName}?` : 'Delete hackathon';
  }

  get confirmLabel(): string {
    return this.data?.hackathonName ? `Delete ${this.data.hackathonName}` : 'Delete hackathon';
  }
}
