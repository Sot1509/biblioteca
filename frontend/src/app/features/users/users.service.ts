
import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = inject(ApiService);

  
  list(perPageOrOpts: number | { per_page?: number; page?: number; q?: string } = 1000): Observable<any> {
    const opts = typeof perPageOrOpts === 'number'
      ? { per_page: perPageOrOpts }
      : (perPageOrOpts ?? {});

    const params = new HttpParams({
      fromObject: {
        ...(opts.per_page ? { per_page: String(opts.per_page) } : {}),
        ...(opts.page ? { page: String(opts.page) } : {}),
        ...(opts.q ? { q: opts.q } : {}),
      },
    });

    
    return this.api.get('users', params);

    
  }

  create(payload: any): Observable<any> {
    return this.api.post('users', payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.api.put(`users/${id}`, payload);
  }

  remove(id: number): Observable<any> {
    return this.api.delete(`users/${id}`);
  }
}
