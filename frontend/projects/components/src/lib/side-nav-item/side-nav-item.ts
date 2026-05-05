import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-side-nav-item',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule],
  templateUrl: './side-nav-item.html',
  styleUrl: './side-nav-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrSideNavItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() href = '';
  @Input() badge = '';
  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<MouseEvent>();

  get itemClass(): string {
    return ['ur-side-nav-item', this.active ? 'ur-side-nav-item--active' : '']
      .filter(Boolean)
      .join(' ');
  }

  onSelect(event: MouseEvent): void {
    this.selected.emit(event);
  }
}
