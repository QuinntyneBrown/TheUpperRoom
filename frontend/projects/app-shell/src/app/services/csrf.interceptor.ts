import { HttpInterceptorFn } from '@angular/common/http';
import { addCsrfHeader } from './csrf.utils';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (SAFE_METHODS.has(req.method)) return next(req);

  const token = addCsrfHeader();
  if (!token) return next(req);

  return next(req.clone({ setHeaders: { 'X-CSRF-TOKEN': token } }));
};
