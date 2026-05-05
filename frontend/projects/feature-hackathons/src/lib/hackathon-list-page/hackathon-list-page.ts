import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HACKATHON_SERVICE, HackathonListRow } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-hackathon-list-page',
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule],
  template: `
    <div class="hackathon-list-page" data-perf-ready="hackathons">
      <div class="hackathon-list-page__header">
        <h1>Hackathons</h1>
        <a mat-raised-button routerLink="/hackathons/new">New Hackathon</a>
      </div>
      @if (loading()) {
        <p role="status">Loading…</p>
      } @else if (loadError()) {
        <div class="hackathon-list-error" data-testid="hackathons-error" role="alert">
          <mat-icon>error_outline</mat-icon>
          <span>Failed to load hackathons.</span>
          <button mat-stroked-button data-testid="hackathons-retry-btn" (click)="load()">Retry</button>
        </div>
      } @else if (rows().length === 0) {
        <div class="hackathon-list-page__empty" data-testid="hackathons-empty">
          <mat-icon>rocket_launch</mat-icon>
          <p>No hackathons yet.</p>
          <a mat-stroked-button routerLink="/hackathons/new" data-testid="hackathons-empty-create-btn">Create first hackathon</a>
        </div>
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
  styles: [`
    .hackathon-list-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .hackathon-list-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .hackathon-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .hackathon-list-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .hackathon-list-page__empty p { margin: 0; font-size: 0.9375rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonListPageComponent {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  rows = signal<HackathonListRow[]>([]);
  loading = signal(true);
  loadError = signal(false);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.hackathonSvc.list().subscribe({
      next: rows => { this.rows.set(rows); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }
}
