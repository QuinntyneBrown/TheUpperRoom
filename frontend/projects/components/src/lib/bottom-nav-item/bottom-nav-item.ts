import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-bottom-nav-item',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './bottom-nav-item.html',
  styleUrl: './bottom-nav-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrBottomNavItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() href = '';
  @Input({ transform: booleanAttribute }) disabled = false;
}
