import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'ur-list-item',
  imports: [MatIconModule, MatListModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrListItemComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() initials = '';
  @Input() imageUrl = '';
  @Input() href = '';
  @Input() meta = '';
  @Input() actionIcon = 'chevron_right';
  @Input() testId = '';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<MouseEvent>();

  get itemClass(): string {
    return 'ur-list-item';
  }

  onSelect(event: MouseEvent): void {
    this.selected.emit(event);
  }
}
