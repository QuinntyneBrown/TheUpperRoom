import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-bottom-nav-item',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './bottom-nav-item.html',
  styleUrl: './bottom-nav-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrBottomNavItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<MouseEvent>();

  get itemClass(): string {
    return ['ur-bottom-nav-item', this.active ? 'ur-bottom-nav-item--active' : '']
      .filter(Boolean)
      .join(' ');
  }

  onSelect(event: MouseEvent): void {
    this.selected.emit(event);
  }
}
