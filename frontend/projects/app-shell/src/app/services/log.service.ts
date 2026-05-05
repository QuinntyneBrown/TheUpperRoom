import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sanitizePayload } from './sanitize';
export { sanitizePayload } from './sanitize';

export interface LogPayload {
  level: string;
  message: string;
  stack?: string;
  route: string;
  version: string;
  userAgent: string;
  correlationId?: string;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  private http = inject(HttpClient);

  report(error: unknown): void {
    const raw = this.buildPayload(error);
    const sanitized = sanitizePayload(raw as unknown as Record<string, unknown>);
    this.http.post('/api/logs', sanitized).subscribe({ error: () => {} });
  }

  private buildPayload(error: unknown): LogPayload {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      level: 'error',
      message: err.message.slice(0, 500),
      stack: err.stack,
      route: window.location.pathname,
      version: '1.0.0',
      userAgent: navigator.userAgent,
    };
  }
}
