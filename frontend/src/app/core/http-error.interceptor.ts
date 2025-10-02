import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from './toast.service';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let msg = 'Error desconocido';

      // Mensaje Laravel típico: { message, errors?: Record<string,string[]> }
      if (typeof err?.error === 'object' && err.error !== null) {
        msg = err.error.message || msg;
        if (err.error.errors) {
          // Concatenamos el primer error de cada campo
          const firsts = Object.values(err.error.errors)
            .map((arr: any) => Array.isArray(arr) ? arr[0] : arr)
            .filter(Boolean);
          if (firsts.length) msg += `: ${firsts.join(' | ')}`;
        }
      } else if (typeof err?.error === 'string') {
        msg = err.error;
      } else if (err.status) {
        msg = `Error ${err.status}: ${err.statusText || 'Solicitud fallida'}`;
      }

      toast.err(msg);
      return throwError(() => err);
    })
  );
};
