import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ur-list-card-list',
  template: `<ng-content />`,
  styleUrl: './list-card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ur-list-card-list' },
})
export class UrListCardListComponent {}
