import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink,
    MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" style="gap:12px">
      <button mat-button routerLink="">Dashboard</button>
      <button mat-button routerLink="books">Libros</button>
      <button mat-button routerLink="loans">Préstamos</button>
      <span style="flex:1 1 auto;"></span>
      <span style="opacity:.85;font-size:.9rem;">Biblioteca</span>
    </mat-toolbar>

    <div style="padding:16px">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    if (!this.auth.isLoggedIn()) { this.router.navigateByUrl('/login'); return; }
    this.auth.logout().subscribe({ next: () => this.router.navigateByUrl('/login') });
  }
}
