import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerListRow, PartnerStage } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { toggleStage, parseStages } from './stage-filter.utils';

const ALL_STAGES: { stage: PartnerStage; label: string }[] = [
  { stage: 'Lead', label: 'Lead' },
  { stage: 'InFunnel', label: 'In Funnel' },
  { stage: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-list-page',
  imports: [RouterLink, MatButtonModule, MatChipsModule],
  template: `
    <div class="partner-list-page" data-perf-ready="partners">
      <div class="partner-list-page__header">
        <h1>Partners</h1>
        <a mat-raised-button routerLink="/partners/new">Add Partner</a>
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
          <p role="status">Loading…</p>
        } @else if (filtered().length === 0) {
          <p>No partners found.</p>
        }
        @for (row of filtered(); track row.id) {
          <a class="partner-card" [routerLink]="['/partners', row.id]">
            <strong>{{ row.name }}</strong>
            <span class="partner-card__meta">{{ row.city }} · {{ row.stage }}</span>
          </a>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerListPageComponent {
  private partnerSvc = inject(PARTNER_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly stages = ALL_STAGES;
  private allRows = signal<PartnerListRow[]>([]);
  loading = signal(true);

  activeStages = signal<PartnerStage[]>([]);

  filtered = computed(() => {
    const active = this.activeStages();
    const rows = this.allRows();
    return active.length === 0 ? rows : rows.filter(r => active.includes(r.stage));
  });

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.activeStages.set(parseStages(params.get('stage')));
    });
    this.partnerSvc.list().subscribe({ next: rows => { this.allRows.set(rows); this.loading.set(false); }, error: () => this.loading.set(false) });
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
