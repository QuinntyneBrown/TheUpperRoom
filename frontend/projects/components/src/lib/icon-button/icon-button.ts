import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-icon-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button type="button" [attr.aria-label]="ariaLabel">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrIconButtonComponent {
  @Input({ required: true }) ariaLabel!: string;
}
