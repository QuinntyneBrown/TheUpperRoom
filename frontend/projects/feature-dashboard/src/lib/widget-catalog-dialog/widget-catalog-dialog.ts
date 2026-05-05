import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { DashboardItem } from 'api';

const WIDGET_TYPES: Array<{ type: string; label: string; cols: number; rows: number }> = [
  { type: 'kpi', label: 'KPI', cols: 3, rows: 2 },
  { type: 'line-chart', label: 'Line Chart', cols: 6, rows: 3 },
];

@Component({
  selector: 'ur-widget-catalog-dialog',
  templateUrl: './widget-catalog-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetCatalogDialogComponent {
  closed = output<void>();
  selected = output<DashboardItem>();

  readonly widgetTypes = WIDGET_TYPES;

  pick(wt: (typeof WIDGET_TYPES)[number]): void {
    this.selected.emit({
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      cols: wt.cols,
      rows: wt.rows,
      type: wt.type,
    });
    this.closed.emit();
  }
}
