import { HttpInterceptorFn } from '@angular/common/http';

export function buildCorrelationId(existing: string | null): string {
  return existing ?? crypto.randomUUID();
}

export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const id = buildCorrelationId(req.headers.get('X-Correlation-Id'));
  if (req.headers.get('X-Correlation-Id') === id) return next(req);
  return next(req.clone({ setHeaders: { 'X-Correlation-Id': id } }));
};
