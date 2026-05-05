import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HACKATHON_SERVICE, HackathonListRow } from 'api';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ur-hackathon-list-page',
  imports: [RouterLink, DatePipe, MatButtonModule],
  template: `
    <div class="hackathon-list-page" data-perf-ready="hackathons">
      <div class="hackathon-list-page__header">
        <h1>Hackathons</h1>
        <a mat-raised-button routerLink="/hackathons/new">New Hackathon</a>
      </div>
      @if (loading()) {
        <p role="status">Loading…</p>
      } @else if (rows().length === 0) {
        <p>No hackathons yet.</p>
      }
      @for (row of rows(); track row.id) {
        <a class="hackathon-card" [routerLink]="['/hackathons', row.id]">
          <strong>{{ row.title }}</strong>
          <span class="hackathon-card__meta">
            {{ row.hostCity }} · {{ row.startDate | date:'mediumDate' }}–{{ row.endDate | date:'mediumDate' }} · {{ row.currentStage }}
          </span>
        </a>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonListPageComponent {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  rows = signal<HackathonListRow[]>([]);
  loading = signal(true);

  constructor() {
    this.hackathonSvc.list().subscribe({ next: rows => { this.rows.set(rows); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
}
