import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerListRow, PartnerStage } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { toggleStage, parseStages } from './stage-filter.utils';

const ALL_STAGES: { stage: PartnerStage; label: string }[] = [
  { stage: 'Lead', label: 'Lead' },
  { stage: 'InFunnel', label: 'In funnel' },
  { stage: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-list-page',
  imports: [RouterLink, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="partner-list-page" data-perf-ready="partners">
      <div class="partner-list-page__header">
        <h1>Partners</h1>
        <a mat-raised-button routerLink="/partners/new" data-testid="new-partner-btn">+ Add partner</a>
      </div>
      <mat-chip-listbox multiple aria-label="Filter by stage">
        @for (s of stages; track s.stage) {
          <mat-chip-option
            [selected]="activeStages().includes(s.stage)"
            (selectionChange)="toggle(s.stage)">
            {{ s.label }}
          </mat-chip-option>
        }
      </mat-chip-listbox>
      <div class="partner-list-page__list">
        @if (loading()) {
          <div class="partner-list-loading" data-testid="partners-list-loading" aria-busy="true" aria-label="Loading partners">
            @for (_ of [1,2,3,4]; track $index) {
              <div class="partner-list-loading__card">
                <div class="partner-list-loading__name"></div>
                <div class="partner-list-loading__meta"></div>
              </div>
            }
          </div>
        } @else if (loadError()) {
          <div class="partner-load-error" data-testid="partners-load-error" role="alert">
            <mat-icon>error_outline</mat-icon>
            <span>Failed to load partners.</span>
            <button mat-stroked-button data-testid="partners-retry-btn" (click)="loadPartners()">Retry</button>
          </div>
        } @else if (filtered().length === 0) {
          <div class="partner-list-page__empty" data-testid="partners-empty">
            <mat-icon>handshake</mat-icon>
            <p>No partners found.</p>
            <a mat-stroked-button routerLink="/partners/new" data-testid="partners-empty-create-btn">Add first partner</a>
          </div>
        }
        @for (row of filtered(); track row.id) {
          <a class="partner-card" [routerLink]="['/partners', row.id]" [attr.data-testid]="'partner-card-' + row.id">
            <strong>{{ row.name }}</strong>
            <span class="partner-card__meta">{{ row.city }} · {{ row.stage }}</span>
          </a>
        }
      </div>
    </div>
    @if (deletedToast()) {
      <div class="partner-list-toast" role="status" data-testid="partner-deleted-toast">
        <mat-icon>check_circle</mat-icon>
        <span>Partner deleted</span>
      </div>
    }
  `,
  styles: [`
    .partner-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .partner-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .partner-list-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .partner-list-loading__card { padding: 14px 16px; border-radius: 8px; border: 1px solid var(--ur-border-subtle, #e2e8f0); display: flex; flex-direction: column; gap: 8px; }
    .partner-list-loading__name { height: 16px; width: 45%; border-radius: 4px; background: var(--ur-skeleton-bg, #f1f5f9); animation: pl-pulse 1.4s ease-in-out infinite; }
    .partner-list-loading__meta { height: 12px; width: 30%; border-radius: 4px; background: var(--ur-skeleton-bg, #f1f5f9); animation: pl-pulse 1.4s ease-in-out infinite; }
    @keyframes pl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .partner-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .partner-list-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .partner-list-page__empty p { margin: 0; font-size: 0.9375rem; }
    .partner-list-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .partner-list-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerListPageComponent implements OnInit, OnDestroy {
  private partnerSvc = inject(PARTNER_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly stages = ALL_STAGES;
  private allRows = signal<PartnerListRow[]>([]);
  loading = signal(true);
  loadError = signal(false);
  deletedToast = signal(false);

  activeStages = signal<PartnerStage[]>([]);

  private deletedToastTimer?: ReturnType<typeof setTimeout>;

  filtered = computed(() => {
    const active = this.activeStages();
    const rows = this.allRows();
    return active.length === 0 ? rows : rows.filter(r => active.includes(r.stage));
  });

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.activeStages.set(parseStages(params.get('stage')));
    });
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.partnerSvc.list().subscribe({
      next: rows => { this.allRows.set(rows); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
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

  toggle(stage: PartnerStage): void {
    const next = toggleStage(this.activeStages(), stage);
    this.activeStages.set(next);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: next.length ? { stage: next.join(',') } : {},
      replaceUrl: true,
    });
  }
}
