import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() titleTestId = '';
  @Input() subtitleTestId = '';
}
