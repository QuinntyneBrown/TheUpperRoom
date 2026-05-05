import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardItem {
  id: string;
  x: number;
  y: number;
  cols: number;
  rows: number;
  type: string;
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  items: DashboardItem[];
}

export interface IDashboardService {
  get(): Observable<{ json: string }>;
  save(json: string): Observable<void>;
}

export const DASHBOARD_SERVICE = new InjectionToken<IDashboardService>('DASHBOARD_SERVICE');

@Injectable({ providedIn: 'root' })
export class DashboardService implements IDashboardService {
  private http = inject(HttpClient);

  get(): Observable<{ json: string }> {
    return this.http.get<{ json: string }>('/api/dashboards/me');
  }

  save(json: string): Observable<void> {
    return this.http.put<void>('/api/dashboards/me', { json });
  }
}
