import { ChangeDetectionStrategy, Component, output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardItem } from 'api';
import { WIDGET_CATALOG } from './widget-catalog';

@Component({
  selector: 'ur-widget-catalog-dialog',
  templateUrl: './widget-catalog-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule],
  styles: [`
    .widget-catalog-dialog {
      display: flex; flex-direction: column;
      background: var(--ur-bg-surface, #1e293b);
      border: 1px solid var(--ur-border-default, #334155);
      border-radius: 12px; padding: 24px; min-width: 360px;
    }
    .widget-catalog-dialog__header {
      display: flex; flex-wrap: wrap; align-items: flex-start;
      gap: 4px; margin-bottom: 16px;
      h2 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); flex: 1 0 100%; }
    }
    .widget-catalog-dialog__subtitle {
      margin: 0; font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); flex: 1;
    }
    .widget-catalog-dialog__list {
      list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0;
    }
    .widget-catalog-dialog__entry {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 0; border-bottom: 1px solid var(--ur-border-subtle, #1e293b);
      &:last-child { border-bottom: none; }
    }
    .widget-catalog-dialog__info {
      display: flex; flex-direction: column; gap: 2px;
    }
    .widget-catalog-dialog__label {
      font-size: 0.9375rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9);
    }
    .widget-catalog-dialog__desc {
      font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b);
    }
  `],
})
export class WidgetCatalogDialogComponent {
  closed = output<void>();
  selected = output<DashboardItem>();

  readonly widgetTypes = WIDGET_CATALOG;

  pick(wt: (typeof WIDGET_CATALOG)[number]): void {
    this.selected.emit({
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      cols: wt.cols,
      rows: wt.rows,
      type: wt.type,
      config: { ...wt.defaultConfig },
    });
    this.closed.emit();
  }
}
