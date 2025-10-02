import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const raw = localStorage.getItem('auth_token'); 

  const shouldAttach = req.url.includes('/api/');

  let authHeader: string | undefined;
  if (raw) {
    
    authHeader = raw.startsWith('Bearer ') || raw.startsWith('Token ')
      ? raw
      : `Bearer ${raw}`;
  }

  const headers: Record<string,string> = { Accept: 'application/json' };
  if (shouldAttach && authHeader) headers['Authorization'] = authHeader;

  const cloned = req.clone({ setHeaders: headers });

  
  const ah = cloned.headers.get('Authorization') || '(sin Authorization)';
  console.log('[AuthInterceptor]', cloned.method, cloned.url, 'Auth:', ah);

  return next(cloned).pipe(
    tap({
      error: (e) => {
        if (e instanceof HttpErrorResponse && e.status === 401) {
          
          console.warn('[AuthInterceptor] 401 en', cloned.url, 'Auth:', ah);
          router.navigate(['/login'], { queryParams: { r: router.url || '/' } });
        }
      }
    })
  );
};
