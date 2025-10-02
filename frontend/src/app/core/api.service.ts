import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(u: string, params?: any) {
    return this.http.get<T>(`${this.base}${u}`, { params });
  }

  post<T>(u: string, body: any) {
    return this.http.post<T>(`${this.base}${u}`, body);
  }

  put<T>(u: string, body: any) {
    return this.http.put<T>(`${this.base}${u}`, body);
  }

  delete<T>(u: string) {
    return this.http.delete<T>(`${this.base}${u}`);
  }
}
