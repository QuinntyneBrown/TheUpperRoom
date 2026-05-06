import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PartnerStage } from 'api';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

export interface StageChangeDialogData {
  pendingStage: PartnerStage;
  stageLabel: string;
}

@Component({
  selector: 'ur-stage-change-dialog',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ur-dialog
      [title]="'Move to ' + data.stageLabel"
      subtitle="This change will be recorded in the stage history with your name and an optional reason."
      icon="trending_up"
      closeLabel="Cancel"
      (closed)="ref.close()"
      data-testid="stage-change-dialog"
    >
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Reason (optional)</mat-label>
        <textarea matInput rows="2" [(ngModel)]="reason" data-testid="stage-change-reason" placeholder="e.g. Signed sponsorship agreement"></textarea>
      </mat-form-field>
      <div ur-dialog-actions style="display:flex;gap:8px">
        <button mat-stroked-button (click)="ref.close()" data-testid="stage-change-cancel-btn">Cancel</button>
        <ur-button (click)="ref.close({ reason })" data-testid="stage-change-confirm-btn">
          Advance partner
        </ur-button>
      </div>
    </ur-dialog>
  `,
})
export class StageChangeDialogComponent {
  ref = inject<UrDialogRef<{ reason: string }>>(UrDialogRef);
  data = inject<StageChangeDialogData>(UR_DIALOG_DATA);
  reason = '';
}
