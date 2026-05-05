import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HealthResult {
  status: string;
  version: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);

  get(): Observable<HealthResult> {
    return this.http.get<HealthResult>('/api/health');
  }
}

export const HEALTH_SERVICE = HealthService;
