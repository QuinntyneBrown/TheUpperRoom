import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HACKATHON_SERVICE, HackathonListRow } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, UrButtonComponent } from 'components';
import { HackathonCreatePageComponent } from '../hackathon-create-page/hackathon-create-page';

@Component({
  selector: 'ur-hackathon-list-page',
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, UrButtonComponent],
  template: `
    <div class="hackathon-list-page" data-perf-ready="hackathons">
      <div class="hackathon-list-page__header">
        <h1 data-testid="hackathons-list-title">Hackathons</h1>
        <ur-button (pressed)="onCreateClick()" data-testid="new-hackathon-btn">+ Plan hackathon</ur-button>
      </div>
      <div class="hackathon-list-page__scroll">
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
            <mat-icon aria-hidden="true">error_outline</mat-icon>
            <span data-testid="hackathons-load-error-message">Failed to load hackathons.</span>
            <ur-button variant="secondary" (pressed)="load()" data-testid="hackathons-retry-btn">Retry</ur-button>
          </div>
        } @else if (rows().length === 0) {
          <div class="hackathon-list-page__empty" data-testid="hackathons-empty">
            <div class="hackathon-list-page__empty-icon-wrap" data-testid="hackathons-empty-icon-wrap" aria-hidden="true">
              <mat-icon aria-hidden="true">rocket_launch</mat-icon>
            </div>
            <h2 data-testid="hackathons-empty-title">No hackathons yet</h2>
            <p data-testid="hackathons-empty-subtitle">Plan your first hackathon to bring your team together.</p>
            <ur-button (pressed)="onCreateClick()" data-testid="hackathons-empty-create-btn">Create first hackathon</ur-button>
          </div>
        } @else {
          <ul class="hackathon-list-page__cards" aria-label="Hackathons">
            @for (row of rows(); track row.id) {
              <li>
                <a class="hackathon-card" [routerLink]="['/hackathons', row.id]" [attr.data-testid]="'hackathon-card-' + row.id">
                  <div class="hackathon-card__top">
                    <div class="hackathon-card__titles">
                      <h3 class="hackathon-card__title" data-testid="hackathon-card-title">{{ row.title }}</h3>
                      <span class="hackathon-card__meta" data-testid="hackathon-card-meta">{{ row.hostCity }} · {{ row.startDate | date:'mediumDate' }}–{{ row.endDate | date:'mediumDate' }}</span>
                    </div>
                    <span class="hackathon-card__stage" data-testid="hackathon-stage-badge">{{ row.currentStage }}</span>
                  </div>
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </div>
    @if (deletedToast()) {
      <div class="hackathon-list-toast" role="status" data-testid="hackathon-deleted-toast">
        <mat-icon aria-hidden="true">check_circle</mat-icon>
        <span data-testid="hackathon-deleted-toast-title">Hackathon deleted</span>
      </div>
    }
  `,
  styles: [`
    .hackathon-list-page { display: flex; flex-direction: column; height: 100%; }
    .hackathon-list-page__header {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
      padding: 16px 24px; border-bottom: 1px solid var(--ur-border-subtle, #222233);
      background: var(--ur-bg-elevated, #101018); height: 64px; flex-shrink: 0;
    }
    .hackathon-list-page__header h1 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); font-family: var(--ur-font-heading, 'Geist', sans-serif); }
    .hackathon-list-page__scroll { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .hackathon-list-page__cards { display: flex; flex-direction: column; gap: 16px; list-style: none; margin: 0; padding: 0; }
    .hackathon-card {
      display: block; padding: 20px; border-radius: 8px;
      border: 1px solid var(--ur-accent-primary, #9f86ff);
      background: var(--ur-bg-elevated, #101018);
      text-decoration: none; color: inherit;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .hackathon-card:hover { background: var(--ur-bg-surface, #16161f); }
    .hackathon-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .hackathon-card__titles { display: flex; flex-direction: column; gap: 4px; }
    .hackathon-card__title { margin: 0; font-size: 1rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); font-family: var(--ur-font-heading, 'Geist', sans-serif); }
    .hackathon-card__meta { font-size: 0.6875rem; color: var(--ur-fg-muted, #a8a8b5); font-family: var(--ur-font-mono, 'Geist Mono', monospace); }
    .hackathon-card__stage {
      flex-shrink: 0; font-size: 0.6875rem; font-family: var(--ur-font-mono, 'Geist Mono', monospace);
      color: var(--ur-accent-primary, #9f86ff); font-weight: 500;
      background: color-mix(in srgb, var(--ur-accent-primary, #9f86ff) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--ur-accent-primary, #9f86ff) 40%, transparent);
      border-radius: 4px; padding: 2px 8px; white-space: nowrap;
    }
    .hackathon-list-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .hackathon-list-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .hackathon-list-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .hackathon-list-loading__card { padding: 16px; border-radius: 8px; border: 1px solid var(--ur-border-subtle, #222233); display: flex; flex-direction: column; gap: 8px; }
    .hackathon-list-loading__title { height: 18px; width: 55%; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: hl-pulse 1.4s ease-in-out infinite; }
    .hackathon-list-loading__meta { height: 13px; width: 70%; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: hl-pulse 1.4s ease-in-out infinite; }
    @keyframes hl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .hackathon-list-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .hackathon-list-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .hackathon-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #a8a8b5);
    }
    .hackathon-list-page__empty mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--ur-accent-primary, #9f86ff); }
    .hackathon-list-page__empty-icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 9999px; background: var(--ur-accent-soft, rgba(159, 134, 255, 0.12)); border: 1px solid var(--ur-accent-primary, #9f86ff); }
    .hackathon-list-page__empty p { margin: 0; font-size: 0.9375rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonListPageComponent implements OnInit, OnDestroy {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(DialogService);

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
    if (this.route.snapshot.data['openCreate']) {
      this.onCreateClick();
    }
  }

  onCreateClick(): void {
    this.dialog.open<HackathonCreatePageComponent, { id: string }>(HackathonCreatePageComponent, { ariaLabel: 'Plan hackathon' })
      .closed$.subscribe(result => {
        if (result?.id) {
          this.router.navigate(['/hackathons', result.id], { queryParams: { saved: '1' } });
        } else if (this.route.snapshot.data['openCreate']) {
          this.router.navigateByUrl('/hackathons');
        }
      });
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
