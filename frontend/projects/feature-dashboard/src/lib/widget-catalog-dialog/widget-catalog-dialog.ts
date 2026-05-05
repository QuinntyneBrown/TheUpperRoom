import { ChangeDetectionStrategy, Component, computed, output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardItem } from 'api';
import { WIDGET_CATALOG } from './widget-catalog';

@Component({
  selector: 'ur-widget-catalog-dialog',
  templateUrl: './widget-catalog-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule],
  styles: [`
    .widget-catalog-dialog {
      display: flex; flex-direction: column;
      background: var(--ur-bg-overlay, #16161f);
      border: 1px solid var(--ur-border-default, #2a2a3a);
      border-radius: 12px; overflow: hidden; min-width: 360px;
    }
    .widget-catalog-dialog__header {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
      padding: 24px; border-bottom: 1px solid var(--ur-border-subtle, #222233);
    }
    .widget-catalog-dialog__header-text { display: flex; flex-direction: column; gap: 4px; }
    .widget-catalog-dialog__header h2 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); font-family: var(--ur-font-heading, 'Geist', sans-serif); }
    .widget-catalog-dialog__subtitle { margin: 0; font-size: 0.8125rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .widget-catalog-dialog__close {
      background: none; border: none; cursor: pointer; padding: 4px;
      color: var(--ur-fg-secondary, #a1a1aa); display: flex; align-items: center; flex-shrink: 0;
    }
    .widget-catalog-dialog__close:hover { color: var(--ur-fg-primary, #f1f5f9); }
    .widget-catalog-dialog__body { display: flex; flex-direction: column; gap: 16px; padding: 24px; }
    .widget-catalog-dialog__section-label {
      font-size: 0.6875rem; font-family: var(--ur-font-mono, 'Geist Mono', monospace);
      color: var(--ur-fg-muted, #64748b); font-weight: 400; letter-spacing: 1px; margin-bottom: 8px;
    }
    .widget-catalog-dialog__section { display: flex; flex-direction: column; gap: 8px; }
    .widget-catalog-dialog__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .widget-catalog-dialog__entry {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border-radius: 8px;
      background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-subtle, #222233);
      cursor: pointer; transition: border-color 0.15s ease;
    }
    .widget-catalog-dialog__entry:hover { border-color: var(--ur-accent-primary, #9f86ff); }
    .widget-catalog-dialog__icon {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: var(--ur-accent-soft, #1e1a2e);
      display: flex; align-items: center; justify-content: center;
    }
    .widget-catalog-dialog__icon mat-icon { color: var(--ur-accent-primary, #9f86ff); font-size: 18px; width: 18px; height: 18px; }
    .widget-catalog-dialog__info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .widget-catalog-dialog__label { font-size: 0.9375rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .widget-catalog-dialog__desc { font-size: 0.8125rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .widget-catalog-dialog__add { color: var(--ur-accent-primary, #9f86ff); display: flex; align-items: center; flex-shrink: 0; }
    .widget-catalog-dialog__add mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class WidgetCatalogDialogComponent {
  closed = output<void>();
  selected = output<DashboardItem>();

  readonly sections = computed(() => {
    const map = new Map<string, typeof WIDGET_CATALOG>();
    for (const entry of WIDGET_CATALOG) {
      if (!map.has(entry.section)) map.set(entry.section, []);
      map.get(entry.section)!.push(entry);
    }
    return Array.from(map.entries()).map(([label, entries]) => ({ label, entries }));
  });

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
