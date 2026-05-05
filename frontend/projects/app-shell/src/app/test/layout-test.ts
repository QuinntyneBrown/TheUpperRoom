import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UrListCardListComponent, UrDetailTwoColumnComponent } from 'components';

@Component({
  selector: 'ur-layout-test',
  imports: [UrListCardListComponent, UrDetailTwoColumnComponent],
  template: `
    <ur-list-card-list>
      <div class="test-card">Card 1</div>
      <div class="test-card">Card 2</div>
      <div class="test-card">Card 3</div>
    </ur-list-card-list>

    <ur-detail-two-column>
      <div slot="main" class="test-main">Main</div>
      <div slot="aside" class="test-aside">Aside</div>
    </ur-detail-two-column>
  `,
  styles: [`.test-card, .test-main, .test-aside { padding: 16px; background: var(--ur-bg-surface); }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTestComponent {}
