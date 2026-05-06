import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type UrButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'icon'
  | 'fab';
export type UrButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ur-button',
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrButtonComponent {
  @Input() variant: UrButtonVariant = 'primary';
  @Input() type: UrButtonType = 'button';
  @Input() form = '';
  @Input() icon = '';
  @Input() iconPosition: 'start' | 'end' = 'start';
  @Input() ariaLabel = '';
  @Input() testId = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) fullWidth = false;

  @Output() pressed = new EventEmitter<MouseEvent>();

  get buttonClass(): string {
    return [
      'ur-button',
      `ur-button--${this.variant}`,
      `ur-button--icon-${this.iconPosition}`,
      this.fullWidth ? 'ur-button--full-width' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  onClick(event: MouseEvent): void {
    this.pressed.emit(event);
  }
}
