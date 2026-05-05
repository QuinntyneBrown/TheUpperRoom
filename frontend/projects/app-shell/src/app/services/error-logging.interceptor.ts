import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { LogService } from './log.service';
import { maskSensitiveQueryParams } from './http-error.utils';

export const errorLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logService = inject(LogService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const correlationId = err.headers?.get('X-Correlation-Id') ?? undefined;
      logService.report({
        level: 'http',
        method: req.method,
        url: maskSensitiveQueryParams(req.url),
        status: err.status,
        correlationId,
      });
      return throwError(() => err);
    })
  );
};
