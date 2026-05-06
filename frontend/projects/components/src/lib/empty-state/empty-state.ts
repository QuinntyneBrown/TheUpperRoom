import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-empty-state',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrEmptyStateComponent {
  @Input() icon = 'inventory_2';
  @Input() title = '';
  @Input() message = '';
  @Input() titleTestId = '';
  @Input() messageTestId = '';
}
