import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
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
  `],
})
export class PartnersBoardPageComponent implements OnInit {
  private partners = inject(PARTNER_SERVICE);

  columns = COLUMNS;
  rows = signal<PartnerListRow[]>([]);
  loadError = signal(false);

  byStage = computed(() => {
    const all = this.rows();
    const map: Record<PartnerStage, PartnerListRow[]> = { Lead: [], InFunnel: [], Confirmed: [] };
    for (const r of all) map[r.stage].push(r);
    return map;
  });

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard(): void {
    this.loadError.set(false);
    this.partners.list().subscribe({
      next: (rows) => this.rows.set(rows),
      error: () => this.loadError.set(true),
    });
  }

  drop(event: CdkDragDrop<PartnerListRow[]>, toStage: PartnerStage): void {
    const row: PartnerListRow = event.item.data;
    if (row.stage === toStage) return;
    this.rows.update(rs => rs.map(r => r.id === row.id ? { ...r, stage: toStage } : r));
    this.partners.changeStage(row.id, toStage).subscribe({
      error: () => this.rows.update(rs => rs.map(r => r.id === row.id ? { ...r, stage: row.stage } : r)),
    });
  }
}
