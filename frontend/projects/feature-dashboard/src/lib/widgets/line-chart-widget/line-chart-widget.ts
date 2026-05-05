import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, ViewChild } from '@angular/core';
import { METRIC_SERVICE, MetricName, REALTIME_SERVICE } from 'api';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { filter, Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'ur-line-chart-widget',
  templateUrl: './line-chart-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartWidgetComponent implements AfterViewInit, OnDestroy {
  private metricSvc = inject(METRIC_SERVICE);
  private realtimeSvc = inject(REALTIME_SERVICE);

  metric = input.required<MetricName>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

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
    this.metricSvc.get(this.metric(), from, to).subscribe({
      next: (dto) => this.renderChart(dto.series.map((p) => p.label), dto.series.map((p) => p.value)),
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
