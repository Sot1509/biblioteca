import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoansService, Loan } from './loans.service';
import { UsersService } from '../users/users.service';
import { BooksService, Book } from '../books/books.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-loans-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
  <div class="grid">
    <mat-card>
      <h2>Crear préstamo</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Usuario</mat-label>
          <mat-select formControlName="user_id" required>
            <mat-option *ngFor="let u of users" [value]="u.id">
              {{ u.name || ('Usuario #' + u.id) }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Libro</mat-label>
          <mat-select formControlName="book_id" required>
            <mat-option *ngFor="let b of books" [value]="b.id">
              {{ b.title }} — {{ b.available_copies }}/{{ b.total_copies }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha préstamo</mat-label>
          <input matInput type="date" formControlName="loan_date" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha límite</mat-label>
          <input matInput type="date" formControlName="due_date" required>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting()">
          <mat-icon>save</mat-icon>&nbsp;Guardar
        </button>
      </form>
    </mat-card>

    <mat-card>
      <h2>Préstamos</h2>

      <div *ngIf="loading(); else tableTpl" class="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <ng-template #tableTpl>
        <table mat-table [dataSource]="rows" class="w100">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>

          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let r">{{ r.user?.name || ('#' + r.user_id) }}</td>
          </ng-container>

          <ng-container matColumnDef="book">
            <th mat-header-cell *matHeaderCellDef>Libro</th>
            <td mat-cell *matCellDef="let r">{{ r.book?.title || ('#' + r.book_id) }}</td>
          </ng-container>

          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Fechas</th>
            <td mat-cell *matCellDef="let r">
              {{ r.loan_date }} → {{ r.due_date }}
              <span *ngIf="r.return_date"> | Devuelto: {{ r.return_date }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let r">
              <button mat-stroked-button color="primary" (click)="returnLoan(r)" [disabled]="!!r.return_date">
                <mat-icon>assignment_turned_in</mat-icon>&nbsp;Devolver
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      </ng-template>
    </mat-card>
  </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 12px;
      margin: 12px;
    }
    .form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
      gap: 12px;
      align-items: end;
    }
    .w100 { width: 100%; }
    .loading { display:grid; place-items:center; height: 180px; }
  `]
})
export class LoansPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loans = inject(LoansService);
  private usersSvc = inject(UsersService);
  private booksSvc = inject(BooksService);
  private toast = inject(ToastService);

  users: Array<{id:number; name?:string}> = [];
  books: Book[] = [];
  rows: Loan[] = [];

  loading = signal(false);
  submitting = signal(false);

  cols = ['id','user','book','dates','actions'];

  form = this.fb.nonNullable.group({
    user_id: [0, [Validators.required]],
    book_id: [0, [Validators.required]],
    loan_date: ['', [Validators.required]],
    due_date: ['', [Validators.required]]
  });

  ngOnInit() {
    this.loadCombos();
    this.reload();
    // defaults fechas: hoy y +7 días
    const today = new Date();
    const plus7 = new Date(); plus7.setDate(today.getDate()+7);
    this.form.patchValue({
      loan_date: today.toISOString().slice(0,10),
      due_date: plus7.toISOString().slice(0,10)
    });
  }

  loadCombos() {
    // usuarios (per_page alto para combo)
    this.usersSvc.list(1000).subscribe({
      next: (res: any) => {
        const data = res.data ?? res;
        this.users = data;
      }
    });

    // libros (per_page alto para combo)
    this.booksSvc.list({ perPage: 1000 }).subscribe({
      next: (res: any) => {
        const data = res.data ?? res;
        this.books = data;
      }
    });
  }

  reload() {
    this.loading.set(true);
    this.loans.list({ page: 1, perPage: 20 }).subscribe({
      next: (p) => { this.rows = p.data ?? []; this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.loans.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.ok('Préstamo creado');
        this.submitting.set(false);
        this.reload();
      },
      error: () => { this.submitting.set(false); }
    });
  }

  returnLoan(row: Loan) {
    if (row.return_date) return;
    this.submitting.set(true);
    this.loans.return(row.id).subscribe({
      next: () => {
        this.toast.ok('Préstamo devuelto');
        this.submitting.set(false);
        this.reload();
      },
      error: () => { this.submitting.set(false); }
    });
  }
}
