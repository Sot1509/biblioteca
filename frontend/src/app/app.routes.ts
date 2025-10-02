import { Routes } from '@angular/router';
import { BooksListComponent } from './features/books/books-list.component';
import { LoansPageComponent } from './features/loans/loans-page';
import { StatsDashboardComponent } from './features/stats/stats-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BooksListComponent },
  { path: 'loans', component: LoansPageComponent },
  { path: 'stats', component: StatsDashboardComponent },
  { path: '**', redirectTo: 'books' },
];
