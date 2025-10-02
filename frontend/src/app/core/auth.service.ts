import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);

  
  user = signal<any | null>(null);

  
  isLoggedIn() { return !!localStorage.getItem('auth_token'); }

  
  login(email: string, password: string) {
    return this.api.post<{ user: any; token: string }>('auth/login', { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
          this.user.set(res.user);
          // DEBUG opcional:
          console.log('[AuthService] token saved?', !!localStorage.getItem('auth_token'));
        })
      );
  }

  
  me() {
    return this.api.get<any>('auth/me')
      .pipe(
        tap(u => {
          localStorage.setItem('auth_user', JSON.stringify(u));
          this.user.set(u);
        })
      );
  }

  
  logout() {
    return this.api.post<any>('auth/logout', {})
      .pipe(
        tap(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          this.user.set(null);
        })
      );
  }

  
  currentUser() {
    try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); }
    catch { return null; }
  }
}
