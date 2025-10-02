import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoansService } from './loans.service';

type Loan = {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;   // ISO (YYYY-MM-DD)
  due_date: string;    // ISO (YYYY-MM-DD)
  returned_at?: string | null;
};

@Component({
  selector: 'app-loans-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 class="title">Préstamos</h2>

    <form class="form" [formGroup]="form" (ngSubmit)="onCreate()">
      <mat-form-field appearance="outline">
        <mat-label>User ID</mat-label>
        <input matInput type="number" formControlName="user_id" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Book ID</mat-label>
        <input matInput type="number" formControlName="book_id" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Fecha préstamo</mat-label>
        <input matInput [matDatepicker]="dp1" formControlName="loan_date" required>
        <mat-datepicker-toggle matSuffix [for]="dp1"></mat-datepicker-toggle>
        <mat-datepicker #dp1></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Fecha vencimiento</mat-label>
        <input matInput [matDatepicker]="dp2" formControlName="due_date" required>
        <mat-datepicker-toggle matSuffix [for]="dp2"></mat-datepicker-toggle>
        <mat-datepicker #dp2></mat-datepicker>
      </mat-form-field>

      <button mat-raised-button color="primary" [disabled]="form.invalid || loading">
        {{ loading ? 'Creando…' : 'Crear préstamo' }}
      </button>
    </form>

    <table mat-table [dataSource]="rows" class="mat-elevation-z8 table">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> # </th>
        <td mat-cell *matCellDef="let r">{{ r.id }}</td>
      </ng-container>

      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef> Usuario </th>
        <td mat-cell *matCellDef="let r">{{ r.user_id }}</td>
      </ng-container>

      <ng-container matColumnDef="book">
        <th mat-header-cell *matHeaderCellDef> Libro </th>
        <td mat-cell *matCellDef="let r">{{ r.book_id }}</td>
      </ng-container>

      <ng-container matColumnDef="dates">
        <th mat-header-cell *matHeaderCellDef> Fechas </th>
        <td mat-cell *matCellDef="let r">
          {{ r.loan_date }} → {{ r.due_date }}
          <span *ngIf="r.returned_at"> | Devuelto: {{ r.returned_at }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Acciones </th>
        <td mat-cell *matCellDef="let r">
          <button mat-button color="accent" (click)="onReturn(r)"
                  [disabled]="!!r.returned_at || returningId === r.id">
            {{ returningId === r.id ? 'Devolviendo…' : (r.returned_at ? 'Devuelto' : 'Devolver') }}
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols; trackBy: trackById"></tr>
    </table>
  `,
  styles: [`
    .title { margin: 16px 0; }
    .form { display: grid; grid-template-columns: repeat(4, minmax(220px, 1fr)); gap: 12px; align-items: end; margin-bottom: 16px; }
    .table { width: 100%; }
    @media (max-width: 900px) { .form { grid-template-columns: 1fr; } }
  `]
})
export class LoansPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(LoansService);
  private snack = inject(MatSnackBar);

  cols = ['id', 'user', 'book', 'dates', 'actions'];
  rows: Loan[] = [];
  loading = false;
  returningId: number | null = null;

  form = this.fb.group({
    user_id: [null, [Validators.required]],
    book_id: [null, [Validators.required]],
    loan_date: [new Date(), [Validators.required]],
    due_date: [new Date(Date.now() + 7*24*60*60*1000), [Validators.required]], // +7 días
  });

  ngOnInit(): void {
    this.load();
  }

  trackById = (_: number, r: Loan) => r.id;

  private toISO(d: Date | string | null): string {
    if (!d) return '';
    return typeof d === 'string' ? d : d.toISOString().slice(0, 10); // YYYY-MM-DD
    // Ajusta si tu backend espera datetime completo.
  }

  load(): void {
    this.svc.list().subscribe({
      next: (res) => this.rows = (res as any)?.data ?? (res as any),
      error: (err) => this.snack.open('Error cargando préstamos', 'Cerrar', { duration: 3000 }),
    });
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const v = this.form.value;
    const payload = {
      user_id: Number(v.user_id),
      book_id: Number(v.book_id),
      loan_date: this.toISO(v.loan_date!),
      due_date: this.toISO(v.due_date!),
    };
    this.svc.create(payload).subscribe({
      next: () => {
        this.snack.open('Préstamo creado', 'OK', { duration: 2000 });
        this.form.reset({
          user_id: null,
          book_id: null,
          loan_date: new Date(),
          due_date: new Date(Date.now() + 7*24*60*60*1000),
        });
        this.load();
      },
      error: (err) => this.snack.open('No se pudo crear el préstamo', 'Cerrar', { duration: 3000 }),
      complete: () => this.loading = false,
    });
  }

  onReturn(r: Loan): void {
    if (r.returned_at) return;
    this.returningId = r.id;
    this.svc.return(r.id).subscribe({
      next: () => {
        this.snack.open('Préstamo devuelto', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => this.snack.open('Error al devolver', 'Cerrar', { duration: 3000 }),
      complete: () => this.returningId = null,
    });
  }
}
