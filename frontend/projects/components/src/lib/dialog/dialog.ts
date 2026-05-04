import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type UrDialogVariant = 'default' | 'accent' | 'danger';

let nextDialogId = 0;

@Component({
  selector: 'ur-dialog',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrDialogComponent {
  @Input() id = `ur-dialog-${nextDialogId++}`;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() variant: UrDialogVariant = 'default';
  @Input() closeLabel = 'Close';
  @Input({ transform: booleanAttribute }) showClose = true;
  @Input({ transform: booleanAttribute }) showActions = true;

  @Output() closed = new EventEmitter<void>();

  get dialogClass(): string {
    return ['ur-dialog', `ur-dialog--${this.variant}`].join(' ');
  }

  close(): void {
    this.closed.emit();
  }
}
