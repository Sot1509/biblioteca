import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private join(path: string) {
    const left  = String(this.base ?? '').replace(/\/+$/, '');
    const right = String(path ?? '').replace(/^\/+/, '');
    return `${left}/${right}`;
  }

  get<T>(u: string, params?: any) { return this.http.get<T>(this.join(u), { params }); }
  post<T>(u: string, body: any)    { return this.http.post<T>(this.join(u), body); }
  put<T>(u: string, body: any)     { return this.http.put<T>(this.join(u), body); }
  delete<T>(u: string)             { return this.http.delete<T>(this.join(u)); }
}
