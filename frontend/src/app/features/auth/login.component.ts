import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="display:grid;place-items:center;height:80vh">
    <mat-card style="width:360px;padding:16px">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="submit()">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="email" name="email" type="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Contraseña</mat-label>
          <input matInput [(ngModel)]="password" name="password" type="password" required />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Entrar</button>
      </form>
    </mat-card>
  </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = 'admin@example.com';
  password = 'prueba';

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/'),
    });
  }
}
