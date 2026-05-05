import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [RouterLink, DragDropModule, MatButtonModule, MatIconModule],
  styles: [`
    .board-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .board-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .board-drop-error {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .board-drop-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .board-loading { display: flex; gap: 16px; margin-top: 8px; }
    .board-loading__col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .board-loading__header { height: 32px; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); }
    .board-loading__card { height: 72px; border-radius: 8px; background: var(--ur-skeleton-bg, #f1f5f9); animation: board-pulse 1.4s ease-in-out infinite; }
    @keyframes board-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .partner-board__columns { display: flex; gap: 16px; overflow-x: auto; height: calc(100vh - 140px); }
    .partner-board__column {
      flex: 1 1 0; min-width: 260px; display: flex; flex-direction: column; gap: 12px;
      padding: 12px; border-radius: 12px; background: var(--ur-bg-surface, #1e293b);
      border: 1px solid var(--ur-border-subtle, #334155);
    }
    .partner-board__col-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 8px; }
    .partner-board__col-label { font-weight: 600; font-size: 0.875rem; color: var(--ur-fg-primary, #f1f5f9); }
    .partner-board__col-count {
      min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
      background: var(--ur-bg-elevated, #334155); color: var(--ur-fg-secondary, #94a3b8); font-size: 0.75rem; font-weight: 600;
    }
    .partner-board__drop-zone { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 120px; }
    .partner-card {
      display: flex; align-items: flex-start; gap: 8px; padding: 12px;
      border-radius: 8px; background: var(--ur-bg-elevated, #334155);
      border: 1px solid var(--ur-border-default, #475569); cursor: pointer;
      text-decoration: none; color: inherit;
    }
    .partner-card:hover { border-color: var(--ur-accent-primary, #6366f1); }
    .partner-card__drag-handle { color: var(--ur-fg-disabled, #64748b); cursor: grab; padding-top: 2px; flex-shrink: 0; }
    .partner-card__body { display: flex; flex-direction: column; gap: 4px; }
    .partner-card__name { margin: 0; font-size: 0.875rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .partner-card__city { margin: 0; font-size: 0.75rem; color: var(--ur-fg-secondary, #94a3b8); }
    .partner-board__empty { display: flex; align-items: center; justify-content: center; padding: 24px; font-size: 0.875rem; color: var(--ur-fg-disabled, #64748b); border: 1px dashed var(--ur-border-default, #475569); border-radius: 8px; }
  `],
})
export class PartnersBoardPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);

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
