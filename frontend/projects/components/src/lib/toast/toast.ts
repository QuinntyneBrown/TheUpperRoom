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
import { UrAlertVariant } from '../alert/alert';

@Component({
  selector: 'ur-toast',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrToastComponent {
  @Input() variant: UrAlertVariant = 'success';
  @Input() icon = '';
  @Input() title = '';
  @Input() message = '';
  @Input({ transform: booleanAttribute }) dismissible = true;

  @Output() dismissed = new EventEmitter<void>();

  get toastClass(): string {
    return ['ur-toast', `ur-toast--${this.variant}`].join(' ');
  }

  get resolvedIcon(): string {
    if (this.icon) {
      return this.icon;
    }

    const icons: Record<UrAlertVariant, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      danger: 'error',
    };

    return icons[this.variant];
  }

  dismiss(): void {
    this.dismissed.emit();
  }
}
