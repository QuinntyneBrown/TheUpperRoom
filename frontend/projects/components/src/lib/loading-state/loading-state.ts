import { ChangeDetectionStrategy, Component, Input, numberAttribute } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ur-loading-state',
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrLoadingStateComponent {
  @Input() label = 'Loading';
  @Input({ transform: numberAttribute }) rows = 3;

  get rowIndexes(): number[] {
    return Array.from({ length: Math.max(0, this.rows) }, (_, index) => index);
  }
}
