import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/api/auth.service';

export const roleGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(state => {
      if (!state || !state.user) {
        router.navigate(['/dashboard']);
        return false;
      }
      if (state.user.role !== 'Manager') {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    })
  );
};
