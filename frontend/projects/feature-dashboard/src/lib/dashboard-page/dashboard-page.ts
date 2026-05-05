import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DASHBOARD_SERVICE, DashboardItem } from 'api';
import { Gridster, GridsterItem } from 'angular-gridster2';
import { debounceTime, Subject } from 'rxjs';
import { WidgetCatalogDialogComponent } from '../widget-catalog-dialog/widget-catalog-dialog';
import { LineChartWidgetComponent } from '../widgets/line-chart-widget/line-chart-widget';
import { buildGridsterOptions } from './gridster-options';

@Component({
  selector: 'ur-dashboard-page',
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Gridster, GridsterItem, WidgetCatalogDialogComponent, LineChartWidgetComponent, MatIconModule],
})
export class DashboardPageComponent implements OnInit {
  private dashboardSvc = inject(DASHBOARD_SERVICE);

  items = signal<DashboardItem[]>([]);
  showCatalog = signal(false);

  private save$ = new Subject<void>();

  options = buildGridsterOptions(() => this.save$.next());

  ngOnInit(): void {
    this.dashboardSvc.get().subscribe({
      next: ({ json }) => {
        try {
          const layout = JSON.parse(json) as { items: DashboardItem[] };
          this.items.set(layout.items ?? []);
        } catch { /* use empty */ }
      }
    });
    this.save$.pipe(debounceTime(300)).subscribe(() => this.persist());
  }

  onWidgetAdded(item: DashboardItem): void {
    this.items.update((prev) => [...prev, item]);
    this.save$.next();
  }

  removeWidget(item: DashboardItem): void {
    this.items.update((prev) => prev.filter((i) => i.id !== item.id));
    this.save$.next();
  }

  private persist(): void {
    const json = JSON.stringify({ items: this.items() });
    this.dashboardSvc.save(json).subscribe();
  }
}
