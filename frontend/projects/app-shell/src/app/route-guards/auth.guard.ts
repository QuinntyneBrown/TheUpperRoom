import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (_route, state: RouterStateSnapshot) => {
  const auth = inject(AUTH_SERVICE);
  const router = inject(Router);
  return auth.me().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/auth/sign-in'], { queryParams: { returnUrl: state.url } }))),
  );
};
