import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../core/api.service';

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;     // 'YYYY-MM-DD'
  due_date: string;      // 'YYYY-MM-DD'
  return_date?: string | null;
  user?: { id: number; name?: string } | any;
  book?: { id: number; title?: string } | any;
}

export interface CreateLoanPayload {
  user_id: number;
  book_id: number;
  loan_date: string; // 'YYYY-MM-DD'
  due_date: string;  // 'YYYY-MM-DD'
}

export interface Page<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// Si el backend a veces devuelve array simple, lo adaptamos a Page<T>
function toPage<T>(res: Page<T> | T[]): Page<T> {
  if (Array.isArray(res)) {
    return {
      data: res,
      total: res.length,
      per_page: res.length,
      current_page: 1,
      last_page: 1,
    };
  }
  return res;
}

@Injectable({ providedIn: 'root' })
export class LoansService {
  private api = inject(ApiService);

  list(opts: { page?: number; perPage?: number; [key: string]: any } = {}): Observable<Page<Loan>> {
  let params = new HttpParams();

  // soporta page y perPage con nombres de la API
  if (opts.page != null)    params = params.set('page', String(opts.page));
  if (opts.perPage != null) params = params.set('per_page', String(opts.perPage));

  // agrega el resto de filtros arbitrarios (status, user_id, etc.)
  Object.entries(opts)
    .filter(([k]) => k !== 'page' && k !== 'perPage')
    .forEach(([k, v]) => {
      if (v != null) params = params.set(k, String(v));
    });

  return this.api.get<Page<Loan> | Loan[]>('loans', params).pipe(
    map(res => toPage<Loan>(res))
  );
}

  create(body: CreateLoanPayload) {
    return this.api.post<Loan>('loans', body);
  }

  return(loanId: number) {
    return this.api.post<Loan>(`loans/${loanId}/return`, {});
  }
}
