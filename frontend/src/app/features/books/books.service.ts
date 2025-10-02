import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../core/api.service';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string | null;
  total_copies: number;
  available_copies: number;
  created_at?: string;
  updated_at?: string;
}

export interface Page<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

/**
 * Si tu backend a veces devuelve array simple (no paginado),
 * este helper lo adapta a Page<T>.
 */
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
export class BooksService {
  private api = inject(ApiService);

  list(opts: { page?: number; perPage?: number; q?: string; sort?: string; order?: 'asc'|'desc' } = {})
  : Observable<Page<Book>> {
    let params = new HttpParams();
    if (opts.page)     params = params.set('page', String(opts.page));
    if (opts.perPage)  params = params.set('per_page', String(opts.perPage)); // Laravel entiende per_page
    if (opts.q)        params = params.set('q', opts.q);
    if (opts.sort)     params = params.set('sort', opts.sort);
    if (opts.order)    params = params.set('order', opts.order);

    return this.api.get<Page<Book> | Book[]>('books', params).pipe(
      map(res => toPage<Book>(res))
    );
  }

  create(payload: Partial<Book>) {
    return this.api.post<Book>('books', payload);
  }

  update(id: number, payload: Partial<Book>) {
    return this.api.put<Book>(`books/${id}`, payload);
  }

  remove(id: number) {
    return this.api.delete<void>(`books/${id}`);
  }
}
