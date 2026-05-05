import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardItem } from 'api';
import { WIDGET_CATALOG } from './widget-catalog';

@Component({
  selector: 'ur-widget-catalog-dialog',
  templateUrl: './widget-catalog-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
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
