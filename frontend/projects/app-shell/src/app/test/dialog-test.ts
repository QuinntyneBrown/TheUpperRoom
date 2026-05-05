import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UrDialogComponent } from 'components';

@Component({
  selector: 'ur-dialog-test',
  imports: [UrDialogComponent],
  template: `
    <button data-testid="dialog-trigger" (click)="open()">Open Dialog</button>
    @if (isOpen()) {
      <ur-dialog
        data-testid="dialog-content"
        title="Test Dialog"
        (closed)="close()"
      >
        <p>Dialog content</p>
      </ur-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTestComponent {
  isOpen = signal(false);
  open(): void { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }
}
