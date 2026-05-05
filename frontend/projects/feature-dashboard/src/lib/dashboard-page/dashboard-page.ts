import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DASHBOARD_SERVICE, DashboardItem } from 'api';
import { Gridster, GridsterItem } from 'angular-gridster2';
import { debounceTime, filter, Subject } from 'rxjs';
import { WidgetCatalogDialogComponent } from '../widget-catalog-dialog/widget-catalog-dialog';
import { LineChartWidgetComponent } from '../widgets/line-chart-widget/line-chart-widget';
import { buildGridsterOptions } from './gridster-options';
import { WIDGET_CATALOG } from '../widget-catalog-dialog/widget-catalog';

const UNDO_MS = 8000;

@Component({
  selector: 'ur-dashboard-page',
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Gridster, GridsterItem, WidgetCatalogDialogComponent, LineChartWidgetComponent, MatButtonModule, MatIconModule],
  styles: [`
    .dashboard-page { display: flex; flex-direction: column; height: 100%; }
    .dashboard-page__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--ur-border-subtle, #e2e8f0); }
    .dashboard-page__header h1 { margin: 0; font-size: 1.25rem; font-weight: 600; }
    .dashboard-page__empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--ur-fg-muted, #888); }
    .dashboard-widget { display: flex; flex-direction: column; height: 100%; background: var(--ur-bg-surface, #101018); border-radius: 8px; border: 1px solid var(--ur-accent-primary, #9f86ff); overflow: hidden; }
    .dashboard-widget__header { display: flex; align-items: center; justify-content: space-between; padding: 6px 6px 6px 8px; background: var(--ur-accent-soft, #1a1432); }
    .dashboard-widget__drag-handle { font-size: 18px; width: 18px; height: 18px; color: var(--ur-accent-primary, #9f86ff); cursor: grab; margin-right: 4px; flex-shrink: 0; }
    .dashboard-widget__label { font-size: 0.75rem; font-weight: 600; color: var(--ur-fg-primary, #fff); flex: 1; }
    .dashboard-widget__body { flex: 1; overflow: hidden; padding: 12px; }
    .dashboard-widget__resize-hint { display: flex; align-items: flex-end; justify-content: flex-end; padding: 2px 4px; }
    .dashboard-widget__resize-hint mat-icon { font-size: 14px; width: 14px; height: 14px; color: var(--ur-accent-primary, #9f86ff); }
    .dashboard-snackbar { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; background: var(--ur-bg-overlay, #1e293b); color: #fff; padding: 12px 16px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 1000; min-width: 280px; }
    .dashboard-snackbar__icon { color: var(--ur-danger, #ef4444); }
    .dashboard-snackbar__text { flex: 1; font-size: 0.875rem; }
    .dashboard-toast { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); z-index: 1000; font-size: 0.875rem; font-weight: 500; }
    .dashboard-toast--saved { background: var(--ur-bg-overlay, #1e293b); color: #fff; border: 1px solid var(--ur-success, #22c55e); }
    .dashboard-toast--saved mat-icon { color: var(--ur-success, #22c55e); }
    .dashboard-toast--error { background: var(--ur-bg-overlay, #1e293b); color: #fff; border: 1px solid var(--ur-danger, #ef4444); }
    .dashboard-toast--error mat-icon { color: var(--ur-danger, #ef4444); }
    .dashboard-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 24px;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .dashboard-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
  `],
})
export class DashboardPageComponent implements OnInit {
  private dashboardSvc = inject(DASHBOARD_SERVICE);

  items = signal<DashboardItem[]>([]);
  showCatalog = signal(false);
  removedWidget = signal<DashboardItem | null>(null);
  savedToast = signal(false);
  saveErrorToast = signal(false);
  loadError = signal(false);

  private save$ = new Subject<void>();
  private suppressSave = true;
  private undoTimer?: ReturnType<typeof setTimeout>;
  private savedTimer?: ReturnType<typeof setTimeout>;
  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  options = buildGridsterOptions(() => this.save$.next());

  ngOnInit(): void {
    this.save$.pipe(debounceTime(300), filter(() => !this.suppressSave)).subscribe(() => this.persist());
    this.loadLayout();
  }

  loadLayout(): void {
    this.suppressSave = true;
    this.loadError.set(false);
    this.dashboardSvc.get().subscribe({
      next: ({ json }) => {
        try {
          const layout = JSON.parse(json) as { items: DashboardItem[] };
          this.items.set(layout.items ?? []);
        } catch { /* use empty */ }
        setTimeout(() => { this.suppressSave = false; }, 500);
      },
      error: () => { this.loadError.set(true); this.suppressSave = false; },
    });
  }

  onWidgetAdded(item: DashboardItem): void {
    this.items.update((prev) => [...prev, item]);
    this.save$.next();
  }

  removeWidget(item: DashboardItem): void {
    clearTimeout(this.undoTimer);
    this.items.update((prev) => prev.filter((i) => i.id !== item.id));
    this.removedWidget.set(item);
    this.save$.next();
    this.undoTimer = setTimeout(() => this.removedWidget.set(null), UNDO_MS);
  }

  undoRemove(): void {
    const item = this.removedWidget();
    if (!item) return;
    clearTimeout(this.undoTimer);
    this.items.update((prev) => [...prev, item]);
    this.removedWidget.set(null);
    this.save$.next();
  }

  private persist(): void {
    const json = JSON.stringify({ items: this.items() });
    this.dashboardSvc.save(json).subscribe({
      next: () => {
        clearTimeout(this.savedTimer);
        this.saveErrorToast.set(false);
        this.savedToast.set(true);
        this.savedTimer = setTimeout(() => this.savedToast.set(false), 2500);
      },
      error: () => {
        clearTimeout(this.saveErrorTimer);
        this.saveErrorToast.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveErrorToast.set(false), 8000);
      },
    });
  }

  retrySave(): void {
    this.saveErrorToast.set(false);
    this.save$.next();
  }

  widgetLabel(type: string): string {
    return WIDGET_CATALOG.find(e => e.type === type)?.label ?? type;
  }
}
