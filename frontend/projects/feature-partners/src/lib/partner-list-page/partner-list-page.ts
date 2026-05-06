import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerListRow, PartnerStage } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, UrButtonComponent } from 'components';
import { PartnerCreatePageComponent } from '../partner-create-page/partner-create-page';
import { toggleStage, parseStages } from './stage-filter.utils';

const ALL_STAGES: { stage: PartnerStage; label: string }[] = [
  { stage: 'Lead', label: 'Lead' },
  { stage: 'InFunnel', label: 'In funnel' },
  { stage: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-list-page',
  imports: [RouterLink, MatButtonModule, MatChipsModule, MatIconModule, UrButtonComponent],
  template: `
    <div class="partner-list-page" data-perf-ready="partners">
      <div class="partner-list-page__header">
        <div class="partner-list-page__title-row">
          <div class="partner-list-page__title-block">
            <h1 data-testid="partners-list-title">Partners</h1>
            <p class="partner-list-page__count" data-testid="partners-count-subtitle">{{ allRows().length }} organizations · {{ leadCount() }} leads · {{ confirmedCount() }} confirmed</p>
          </div>
          <div class="partners-view-toggle">
            <a class="partners-view-toggle__btn partners-view-toggle__btn--active" routerLink="/partners" data-testid="partners-list-tab" aria-label="List view" aria-current="page">List</a>
            <a class="partners-view-toggle__btn" routerLink="/partners/board" data-testid="partners-board-tab" aria-label="Board view">Board</a>
          </div>
        </div>
        <ur-button (pressed)="onCreateClick()" data-testid="new-partner-btn">+ Add partner</ur-button>
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
            <mat-icon aria-hidden="true">error_outline</mat-icon>
            <span>Failed to load partners.</span>
            <ur-button variant="secondary" (pressed)="loadPartners()" data-testid="partners-retry-btn">Retry</ur-button>
          </div>
        } @else if (filtered().length === 0) {
          <div class="partner-list-page__empty" data-testid="partners-empty">
            <div class="partner-list-page__empty-icon-wrap" data-testid="partners-empty-icon-wrap" aria-hidden="true">
              <mat-icon aria-hidden="true">handshake</mat-icon>
            </div>
            <h2 data-testid="partners-empty-title">No partners found</h2>
            <ur-button (pressed)="onCreateClick()" data-testid="partners-empty-create-btn">Add first partner</ur-button>
          </div>
        }
        @for (row of filtered(); track row.id) {
          <a class="partner-card" [routerLink]="['/partners', row.id]" [attr.data-testid]="'partner-card-' + row.id">
            <strong>{{ row.name }}</strong>
            <span class="partner-card__meta">{{ row.city }} · {{ stageLabel(row.stage) }}</span>
          </a>
        }
      </div>
    </div>
    @if (deletedToast()) {
      <div class="partner-list-toast" role="status" data-testid="partner-deleted-toast">
        <mat-icon aria-hidden="true">check_circle</mat-icon>
        <span data-testid="partner-deleted-toast-title">Partner deleted</span>
      </div>
    }
  `,
  styles: [`
    .partner-list-page { display: flex; flex-direction: column; height: 100%; }
    .partner-list-page__header {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
      height: 56px; padding: 0 20px; border-bottom: 1px solid var(--ur-border-subtle, #222233);
      background: var(--ur-bg-elevated, #101018);
    }
    .partner-list-page__title-row { display: flex; align-items: center; gap: 12px; }
    .partner-list-page__title-block { display: flex; flex-direction: column; gap: 2px; }
    .partner-list-page__header h1 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .partner-list-page__count { margin: 0; font-size: 0.75rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .partners-view-toggle {
      display: flex; align-items: center; border-radius: 6px;
      background: var(--ur-bg-base, #0e0e16); border: 1px solid var(--ur-border-default, #2a2a3a);
      overflow: hidden;
    }
    .partners-view-toggle__btn {
      padding: 4px 12px; font-size: 0.75rem; font-weight: 500; line-height: 1.5;
      color: var(--ur-fg-muted, #7a7a87); text-decoration: none; transition: background 0.12s, color 0.12s;
    }
    .partners-view-toggle__btn--active { background: var(--ur-accent-primary, #9f86ff); color: #fff; }
    .partner-list-page__list { display: flex; flex-direction: column; gap: 8px; padding: 32px; }
    .partner-card {
      display: flex; flex-direction: row; align-items: center; gap: 12px; padding: 12px;
      border-radius: 8px; border: 1px solid var(--ur-border-subtle, #222233);
      background: var(--ur-bg-elevated, #101018);
      text-decoration: none; color: inherit; transition: border-color 0.15s;
    }
    .partner-card:hover { border-color: var(--ur-accent-primary, #9f86ff); }
    .partner-card strong { font-size: 0.875rem; font-weight: 500; color: var(--ur-fg-primary, #fff); flex: 1; min-width: 0; }
    .partner-card__meta { font-size: 0.875rem; color: var(--ur-fg-secondary, #a1a1aa); white-space: nowrap; }
    .partner-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .partner-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .partner-list-loading { display: flex; flex-direction: column; gap: 8px; }
    .partner-list-loading__card { padding: 12px; border-radius: 8px; border: 1px solid var(--ur-border-subtle, #222233); background: var(--ur-bg-elevated, #101018); display: flex; flex-direction: column; gap: 8px; }
    .partner-list-loading__name { height: 14px; width: 45%; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: pl-pulse 1.4s ease-in-out infinite; }
    .partner-list-loading__meta { height: 12px; width: 30%; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: pl-pulse 1.4s ease-in-out infinite; }
    @keyframes pl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .partner-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #a8a8b5);
    }
    .partner-list-page__empty-icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 96px; height: 96px; border-radius: 9999px;
      background: var(--ur-bg-input, #1a1a25);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
    .partner-list-page__empty-icon-wrap mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--ur-fg-muted, #7a7a87); }
    .partner-list-page__empty p { margin: 0; font-size: 0.875rem; }
    .partner-list-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
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
  private dialog = inject(DialogService);

  readonly stages = ALL_STAGES;
  allRows = signal<PartnerListRow[]>([]);
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

  leadCount = computed(() => this.allRows().filter(r => r.stage === 'Lead').length);
  confirmedCount = computed(() => this.allRows().filter(r => r.stage === 'Confirmed').length);

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
    if (this.route.snapshot.data['openCreate']) {
      this.onCreateClick();
    }
  }

  onCreateClick(): void {
    this.dialog.open<PartnerCreatePageComponent, { id: string }>(PartnerCreatePageComponent, { ariaLabel: 'New partner' })
      .closed$.subscribe(result => {
        if (result?.id) {
          this.router.navigate(['/partners', result.id], { queryParams: { saved: '1' } });
        } else if (this.route.snapshot.data['openCreate']) {
          this.router.navigateByUrl('/partners');
        }
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.deletedToastTimer);
  }

  stageLabel(stage: PartnerStage): string {
    return ALL_STAGES.find(s => s.stage === stage)?.label ?? stage;
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
