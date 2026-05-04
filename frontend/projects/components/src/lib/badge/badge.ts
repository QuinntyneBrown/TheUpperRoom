import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

export type UrBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

@Component({
  selector: 'ur-badge',
  imports: [MatChipsModule],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrBadgeComponent {
  @Input() variant: UrBadgeVariant = 'default';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) disabled = false;

  get badgeClass(): string {
    return ['ur-badge', `ur-badge--${this.variant}`].join(' ');
  }
}
