import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { map, catchError, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AUTH_SERVICE);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) return of(true);

  return auth.me().pipe(
    map((user) => {
      const hasRole = requiredRoles.some((r) => user.roles?.includes(r));
      return hasRole ? true : router.createUrlTree(['/no-access']);
    }),
    catchError(() => of(router.createUrlTree(['/no-access']))),
  );
};
