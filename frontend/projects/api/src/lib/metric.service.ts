import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface MetricPoint {
  label: string;
  value: number;
}

export interface MetricDto {
  metric: string;
  series: MetricPoint[];
}

export type MetricName = 'contactsCreatedDaily' | 'partnerStageTransitionsWeekly' | 'hackathonStageProgress';

export interface IMetricService {
  get(metric: MetricName, from: Date, to: Date, bucket?: string): Observable<MetricDto>;
}

export const METRIC_SERVICE = new InjectionToken<IMetricService>('METRIC_SERVICE');

@Injectable({ providedIn: 'root' })
export class MetricService implements IMetricService {
  private http = inject(HttpClient);

  get(metric: MetricName, from: Date, to: Date, bucket = 'day'): Observable<MetricDto> {
    const params = {
      from: from.toISOString(),
      to: to.toISOString(),
      bucket,
    };
    return this.http.get<MetricDto>(`/api/metrics/${metric}`, { params });
  }
}
