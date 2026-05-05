import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PARTNER_SERVICE, PartnerListRow, PartnerStage } from 'api';

const COLUMNS: { stage: PartnerStage; label: string }[] = [
  { stage: 'Lead', label: 'Lead' },
  { stage: 'InFunnel', label: 'In Funnel' },
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
