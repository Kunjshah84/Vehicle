// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, throwError } from 'rxjs';
// import { AuthService } from '../services/auth.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   const token = auth.getAccessToken();

//   const authReq = token
//     ? req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       })
//     : req;

//   return next(authReq).pipe(
//     catchError(err => {
//       if (err.status === 401) {
//         alert('Session expired. Please login again.');
//         router.navigate(['/login']);
//       }
//       return throwError(() => err);
//     })
//   );
// };



import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const router = inject(Router);

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
    : req;

  return next(authReq).pipe(
    catchError(error => {

      if (error.status !== 401) {
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        switchMap(res => {
          localStorage.setItem('access_token', res.token);
          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`
              },
              withCredentials: true
            })
          );
        }),
        catchError(err => {
          auth.clearAuthState();
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    })
  );
};

