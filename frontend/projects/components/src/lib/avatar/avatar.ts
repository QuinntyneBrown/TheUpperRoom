import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

export type UrAvatarSize = 'sm' | 'md' | 'lg';
export type UrAvatarTone = 'default' | 'accent';

@Component({
  selector: 'ur-avatar',
  imports: [MatCardModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrAvatarComponent {
  @Input() initials = '';
  @Input() imageUrl = '';
  @Input() alt = '';
  @Input() size: UrAvatarSize = 'md';
  @Input() tone: UrAvatarTone = 'accent';
  @Input() testId = '';

  get avatarClass(): string {
    return ['ur-avatar', `ur-avatar--${this.size}`, `ur-avatar--${this.tone}`].join(' ');
  }
}
