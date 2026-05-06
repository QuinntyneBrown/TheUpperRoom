import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService, UrDialogComponent, UrDialogRef } from 'components';

@Component({
  selector: 'ur-dialog-test-content',
  imports: [UrDialogComponent],
  template: `
    <ur-dialog data-testid="dialog-content" title="Test Dialog" (closed)="ref.close()">
      <p>Dialog content</p>
    </ur-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTestContentComponent {
  ref = inject<UrDialogRef<void>>(UrDialogRef);
}

@Component({
  selector: 'ur-dialog-test',
  template: `<button data-testid="dialog-trigger" (click)="open()">Open Dialog</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTestComponent {
  private dialog = inject(DialogService);
  open(): void { this.dialog.open(DialogTestContentComponent, { ariaLabel: 'Test Dialog' }); }
}
