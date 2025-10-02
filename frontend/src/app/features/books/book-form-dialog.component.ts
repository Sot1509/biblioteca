import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface BookFormData {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  total_copies?: number;
  available_copies?: number;
}

@Component({
  selector: 'app-book-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Editar libro' : 'Nuevo libro' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding: 8px 24px 24px;">
      <mat-form-field appearance="outline" class="full">
        <mat-label>Título</mat-label>
        <input matInput formControlName="title" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Autor</mat-label>
        <input matInput formControlName="author" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Género</mat-label>
        <input matInput formControlName="genre">
      </mat-form-field>

      <div class="row">
        <mat-form-field appearance="outline">
          <mat-label>Copias totales</mat-label>
          <input matInput type="number" formControlName="total_copies" min="1" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Copias disponibles</mat-label>
          <input matInput type="number" formControlName="available_copies" min="0" required>
        </mat-form-field>
      </div>

      <div style="display:flex; gap:12px; justify-content:flex-end; margin-top: 8px;">
        <button mat-stroked-button type="button" (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" [disabled]="form.invalid">
          {{ data?.id ? 'Guardar' : 'Crear' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .row { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
    .full { width:100%; }
  `]
})
export class BookFormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<BookFormDialogComponent, BookFormData | null>,
    @Inject(MAT_DIALOG_DATA) public data: BookFormData | null
  ) {
    // ✅ crear el form aquí (ya tenemos data inyectada)
    this.form = this.fb.group({
      title: [data?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      author: [data?.author ?? '', [Validators.required, Validators.maxLength(255)]],
      genre: [data?.genre ?? '', [Validators.maxLength(100)]],
      total_copies: [data?.total_copies ?? 1, [Validators.required, Validators.min(1)]],
      available_copies: [data?.available_copies ?? data?.total_copies ?? 1, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    // fusiona datos originales (id, etc.) con el formulario
    this.ref.close({ ...(this.data ?? {}), ...this.form.value });
  }

  close() { this.ref.close(null); }
}
