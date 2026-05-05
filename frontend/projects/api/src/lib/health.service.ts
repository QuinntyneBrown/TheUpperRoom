import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface HealthResult {
  status: string;
  version: string;
  time: string;
}

export interface IHealthService {
  get(): Observable<HealthResult>;
}

export const HEALTH_SERVICE = new InjectionToken<IHealthService>('HEALTH_SERVICE');

@Injectable({ providedIn: 'root' })
export class HealthService implements IHealthService {
  private http = inject(HttpClient);

  get(): Observable<HealthResult> {
    return this.http.get<HealthResult>('/api/health');
  }
}
