import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ur-responsive-container',
  template: `<div class="ur-responsive-container"><ng-content /></div>`,
  styles: [`
    .ur-responsive-container {
      width: 100%;
      max-width: 1440px;
      margin-inline: auto;
      padding-inline: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveContainerComponent {}
