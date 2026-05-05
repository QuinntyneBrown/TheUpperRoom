import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LiveRegionService } from './live-region.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ur-live-region',
  imports: [AsyncPipe],
  template: `<div aria-live="polite" aria-atomic="true" class="ur-live-region">{{ service.message$ | async }}</div>`,
  styles: [`.ur-live-region { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrLiveRegionComponent {
  readonly service = inject(LiveRegionService);
}
