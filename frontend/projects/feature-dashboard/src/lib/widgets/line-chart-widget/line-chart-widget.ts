import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { METRIC_SERVICE, MetricName, REALTIME_SERVICE } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { filter, Subscription } from 'rxjs';

Chart.register(...registerables);

const BADGE_CONFIG: Record<string, { label: string; icon: string }> = {
  connected: { label: 'Live', icon: 'wifi' },
  connecting: { label: 'Reconnecting', icon: 'sync' },
  disconnected: { label: 'Offline', icon: 'wifi_off' },
};

@Component({
  selector: 'ur-line-chart-widget',
  templateUrl: './line-chart-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  styles: [`
    .chart-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;
      line-height: 1.5; cursor: default;
    }
    .chart-badge span.material-symbols-outlined { font-size: 12px; width: 12px; height: 12px; }
    .chart-badge--connected { background: var(--ur-success-bg, #dcfce7); color: var(--ur-success-fg, #166534); }
    .chart-badge--connecting { background: var(--ur-warn-bg, #fef9c3); color: var(--ur-warn-fg, #854d0e); }
    .chart-badge--disconnected { background: var(--ur-danger-bg, #fee2e2); color: var(--ur-danger-fg, #991b1b); }
    .line-chart-widget--dimmed canvas { opacity: 0.4; }
    .chart-header { display: flex; align-items: center; justify-content: flex-end; padding: 4px 8px; }
    .chart-body { position: relative; flex: 1; }
    .chart-load-error {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; background: var(--ur-bg-surface, #fff); color: var(--ur-error-fg, #dc2626);
      font-size: 0.875rem; text-align: center; border-radius: 4px;
    }
    .chart-load-error mat-icon { font-size: 24px; width: 24px; height: 24px; }
  `],
})
export class LineChartWidgetComponent implements AfterViewInit, OnDestroy {
  private metricSvc = inject(METRIC_SERVICE);
  private realtimeSvc = inject(REALTIME_SERVICE);

  metric = input.required<MetricName>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  connectionState = toSignal(this.realtimeSvc.connectionState$, { initialValue: 'disconnected' as const });
  readonly badgeConfig = BADGE_CONFIG;

  loadError = signal(false);

  private chart: Chart | null = null;
  private sub: Subscription | null = null;

  readonly chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { ticks: { color: '#e5e7eb' } }, y: { ticks: { color: '#e5e7eb' } } },
  };

  ngAfterViewInit(): void {
    this.loadData();
    this.sub = this.realtimeSvc.events$.pipe(
      filter((e) => e.eventType === `metricInvalidated:${this.metric()}`)
    ).subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.destroy();
  }

  private loadData(): void {
    const to = new Date();
    const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.loadError.set(false);
    this.metricSvc.get(this.metric(), from, to).subscribe({
      next: (dto) => this.renderChart(dto.series.map((p) => p.label), dto.series.map((p) => p.value)),
      error: () => this.loadError.set(true),
    });
  }

  private renderChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.data.labels = labels;
      (this.chart.data.datasets[0] as ChartData<'line'>['datasets'][0]).data = data;
      this.chart.update();
      return;
    }
    const ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: this.metric(), data, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', tension: 0.3 }],
      },
      options: this.chartOptions,
    });
  }
}
