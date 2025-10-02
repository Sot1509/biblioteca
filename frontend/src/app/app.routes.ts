// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/stats/stats-dashboard.component')
      .then(m => m.StatsDashboardComponent),
    
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/books-list.component')
      .then(m => m.BooksListComponent),
    
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./features/loans/loans-page.component')
      .then(m => m.LoansPageComponent),
    
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users-list.component')
      .then(m => m.UsersListComponent),
    
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component')
      .then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];
