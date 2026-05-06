import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type UrAlertVariant = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ur-alert',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrAlertComponent {
  @Input() variant: UrAlertVariant = 'info';
  @Input() icon = '';
  @Input() title = '';
  @Input() message = '';

  get alertClass(): string {
    return ['ur-alert', `ur-alert--${this.variant}`].join(' ');
  }

  get ariaRole(): 'alert' | 'status' {
    return this.variant === 'danger' || this.variant === 'warning' ? 'alert' : 'status';
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
}
