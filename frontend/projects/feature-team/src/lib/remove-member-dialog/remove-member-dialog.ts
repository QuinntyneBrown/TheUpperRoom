import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';
import { TeamMemberDto } from 'api';

@Component({
  selector: 'ur-remove-member-dialog',
  imports: [UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog title="Remove member" variant="danger" icon="person_remove" closeLabel="Cancel" (closed)="ref.close()" data-testid="remove-member-dialog">
      <p>Remove {{ data.member.displayName }} from the team? This cannot be undone.</p>
      <div ur-dialog-actions style="display:flex;gap:8px">
        <ur-button variant="ghost" (click)="ref.close()" data-testid="remove-member-cancel-btn">Cancel</ur-button>
        <ur-button variant="danger" (click)="ref.close(true)" data-testid="confirm-remove-btn">Confirm remove</ur-button>
      </div>
    </ur-dialog>
  `,
})
export class RemoveMemberDialogComponent {
  ref = inject<UrDialogRef<boolean>>(UrDialogRef);
  data = inject<{ member: TeamMemberDto }>(UR_DIALOG_DATA);
}
