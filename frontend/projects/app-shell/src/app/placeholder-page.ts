import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ur-placeholder-page',
  template: `<div class="placeholder-page"><p>Coming soon.</p></div>`,
  styles: ['.placeholder-page { padding: 2rem; color: var(--fg-muted, #888); }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPageComponent {}
