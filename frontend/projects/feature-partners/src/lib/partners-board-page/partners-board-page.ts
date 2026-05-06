import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';
import { PARTNER_SERVICE, PartnerListRow, PartnerStage } from 'api';

const COLUMNS: { stage: PartnerStage; label: string }[] = [
  { stage: 'Lead', label: 'Lead' },
  { stage: 'InFunnel', label: 'In funnel' },
  { stage: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partners-board-page',
  templateUrl: './partners-board-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DragDropModule, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .partner-board { display: flex; flex-direction: column; height: 100%; }
    .partner-board__header {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
      height: 56px; padding: 0 20px; border-bottom: 1px solid var(--ur-border-subtle, #222233);
      background: var(--ur-bg-elevated, #101018); flex-shrink: 0;
    }
    .partner-board__title-row { display: flex; align-items: center; gap: 12px; }
    .partner-board__header h1 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
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
    .board-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 24px;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .board-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .board-drop-error {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 6px; margin: 8px 24px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .board-drop-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .board-loading { display: flex; gap: 16px; padding: 24px; }
    .board-loading__col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .board-loading__header { height: 32px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: board-pulse 1.4s ease-in-out infinite; }
    .board-loading__card { height: 72px; border-radius: 8px; background: var(--ur-border-default, #2a2a3a); animation: board-pulse 1.4s ease-in-out infinite; }
    @keyframes board-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .partner-board__columns { display: flex; gap: 16px; overflow-x: auto; padding: 24px; flex: 1; }
    .partner-board__column {
      flex: 1 1 0; min-width: 260px; display: flex; flex-direction: column; gap: 12px;
      padding: 12px; border-radius: 8px; background: var(--ur-bg-elevated, #101018);
      border: 1px solid var(--ur-border-subtle, #222233);
    }
    .partner-board__col-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 4px; }
    .partner-board__col-label { font-weight: 600; font-size: 0.875rem; color: var(--ur-fg-primary, #fff); }
    .partner-board__col-count { font-size: 0.6875rem; color: var(--ur-fg-muted, #7a7a87); font-family: 'Geist Mono', monospace; }
    .partner-board__drop-zone { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 120px; }
    .partner-card {
      display: flex; align-items: flex-start; gap: 8px; padding: 12px;
      border-radius: 6px; background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-default, #2a2a3a); cursor: pointer;
      text-decoration: none; color: inherit;
    }
    .partner-card:hover { border-color: var(--ur-accent-primary, #9f86ff); }
    .partner-card__drag-handle { color: var(--ur-fg-muted, #7a7a87); cursor: grab; padding-top: 2px; flex-shrink: 0; }
    .partner-card__body { display: flex; flex-direction: column; gap: 4px; }
    .partner-card__name { margin: 0; font-size: 0.75rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .partner-card__city { margin: 0; font-size: 0.6875rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .partner-board__empty {
      display: flex; align-items: center; justify-content: center; gap: 8px; padding: 24px;
      font-size: 0.6875rem; color: var(--ur-fg-muted, #7a7a87); font-family: 'Geist Mono', monospace;
      border: 1px dashed var(--ur-border-default, #2a2a3a); border-radius: 6px;
      background: var(--ur-bg-base, #0a0a0f);
    }
  `],
})
export class PartnersBoardPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private router = inject(Router);

  columns = COLUMNS;
  rows = signal<PartnerListRow[]>([]);
  loadError = signal(false);
  dropError = signal(false);
  loading = signal(true);

  private dropErrorTimer?: ReturnType<typeof setTimeout>;

  byStage = computed(() => {
    const all = this.rows();
    const map: Record<PartnerStage, PartnerListRow[]> = { Lead: [], InFunnel: [], Confirmed: [] };
    for (const r of all) map[r.stage].push(r);
    return map;
  });

  ngOnInit(): void {
    this.loadBoard();
  }

  goToCreate(): void {
    this.router.navigateByUrl('/partners/new');
  }

  ngOnDestroy(): void {
    clearTimeout(this.dropErrorTimer);
  }

  loadBoard(): void {
    this.loadError.set(false);
    this.loading.set(true);
    this.partners.list().subscribe({
      next: (rows) => { this.rows.set(rows); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }

  drop(event: CdkDragDrop<PartnerListRow[]>, toStage: PartnerStage): void {
    const row: PartnerListRow = event.item.data;
    if (row.stage === toStage) return;
    this.rows.update(rs => rs.map(r => r.id === row.id ? { ...r, stage: toStage } : r));
    this.partners.changeStage(row.id, toStage).subscribe({
      error: () => {
        this.rows.update(rs => rs.map(r => r.id === row.id ? { ...r, stage: row.stage } : r));
        clearTimeout(this.dropErrorTimer);
        this.dropError.set(true);
        this.dropErrorTimer = setTimeout(() => this.dropError.set(false), 4000);
      },
    });
  }
}
