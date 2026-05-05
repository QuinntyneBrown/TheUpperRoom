import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
        <div class="hackathon-list-loading" data-testid="hackathons-list-loading" aria-busy="true" aria-label="Loading hackathons">
          @for (_ of [1,2,3]; track $index) {
            <div class="hackathon-list-loading__card">
              <div class="hackathon-list-loading__title"></div>
              <div class="hackathon-list-loading__meta"></div>
            </div>
          }
        </div>
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
    @if (deletedToast()) {
      <div class="hackathon-list-toast" role="status" data-testid="hackathon-deleted-toast">
        <mat-icon>check_circle</mat-icon>
        <span>Hackathon deleted</span>
      </div>
    }
  `,
  styles: [`
    .hackathon-list-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .hackathon-list-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .hackathon-list-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .hackathon-list-loading__card { padding: 16px; border-radius: 8px; border: 1px solid var(--ur-border-subtle, #e2e8f0); display: flex; flex-direction: column; gap: 8px; }
    .hackathon-list-loading__title { height: 18px; width: 55%; border-radius: 4px; background: var(--ur-skeleton-bg, #f1f5f9); animation: hl-pulse 1.4s ease-in-out infinite; }
    .hackathon-list-loading__meta { height: 13px; width: 70%; border-radius: 4px; background: var(--ur-skeleton-bg, #f1f5f9); animation: hl-pulse 1.4s ease-in-out infinite; }
    @keyframes hl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .hackathon-list-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .hackathon-list-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .hackathon-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .hackathon-list-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .hackathon-list-page__empty p { margin: 0; font-size: 0.9375rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonListPageComponent implements OnInit, OnDestroy {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  rows = signal<HackathonListRow[]>([]);
  loading = signal(true);
  loadError = signal(false);
  deletedToast = signal(false);

  private deletedToastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('deleted') === '1') {
      this.deletedToast.set(true);
      this.deletedToastTimer = setTimeout(() => this.deletedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.deletedToastTimer);
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
