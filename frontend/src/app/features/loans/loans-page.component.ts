import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoansService } from './loans.service';

@Component({
  selector: 'app-loans-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2>Préstamos</h2>

    <!-- Formulario para crear préstamo -->
    <form [formGroup]="form" (ngSubmit)="create()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>User ID</mat-label>
        <input matInput formControlName="user_id" type="number" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Book ID</mat-label>
        <input matInput formControlName="book_id" type="number" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Loan Date</mat-label>
        <input matInput formControlName="loan_date" type="date" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Due Date</mat-label>
        <input matInput formControlName="due_date" type="date" required>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
        Crear préstamo
      </button>
    </form>

    <!-- Lista de préstamos -->
    <table mat-table [dataSource]="rows" class="mat-elevation-z8">
      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>Usuario</th>
        <td mat-cell *matCellDef="let r">{{r.user_id}}</td>
      </ng-container>

      <ng-container matColumnDef="book">
        <th mat-header-cell *matHeaderCellDef>Libro</th>
        <td mat-cell *matCellDef="let r">{{r.book_id}}</td>
      </ng-container>

      <ng-container matColumnDef="dates">
        <th mat-header-cell *matHeaderCellDef>Fechas</th>
        <td mat-cell *matCellDef="let r">{{r.loan_date}} → {{r.due_date}}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let r">
          <button mat-button color="accent" (click)="return(r.id)">Devolver</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>
  `,
  styles: [`
    .form {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    mat-form-field { flex: 1; min-width: 200px; }
    table { width: 100%; margin-top: 20px; }
  `]
})
export class LoansPageComponent implements OnInit {
  form: any;   // primero declaramos la propiedad sin inicializar

  rows: any[] = [];
  cols = ['user','book','dates','actions'];

  constructor(private fb: FormBuilder, private loans: LoansService) {}

  ngOnInit() {
    // aquí ya tenemos disponible `fb`
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      book_id: ['', Validators.required],
      loan_date: ['', Validators.required],
      due_date: ['', Validators.required],
    });

    this.load();
  }

  load() {
    this.loans.list().subscribe(res => this.rows = (res as any).data ?? res);
  }

  create() {
    if (this.form.valid) {
      this.loans.create(this.form.value as any).subscribe(() => {
        this.form.reset();
        this.load();
      });
    }
  }

  return(id: number) {
    this.loans.return(id).subscribe(() => this.load());
  }
}

