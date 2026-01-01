import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh')
  ) {
    return next(req);
  }

  const token = auth.getAccessToken();

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
    : req;

  return next(authReq).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token =>
            next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
                withCredentials: true
              })
            )
          )
        );
      }
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return auth.refreshToken().pipe(
        switchMap(res => {
          isRefreshing = false;
          auth.setAccessToken(res.token);
          refreshTokenSubject.next(res.token);

          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
              withCredentials: true
            })
          );
        }),
        catchError(err => {
          isRefreshing = false;
          refreshTokenSubject.next(null);
          auth.clearAuthState();
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    })
  );
};
