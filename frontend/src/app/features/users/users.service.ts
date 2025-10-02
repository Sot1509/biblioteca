import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = inject(ApiService);

  list(perPage = 1000): Observable<any> {
    const params = new HttpParams().set('per_page', String(perPage));
    return this.api.get('users', params);
  }
}
