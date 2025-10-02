import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface UserFormData {
  id?: number;
  name?: string;
  email?: string;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding: 8px 24px 24px;">
      <mat-form-field appearance="outline" class="full">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" required>
      </mat-form-field>

      <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
        <button type="button" mat-stroked-button (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" [disabled]="form.invalid">
          {{ data?.id ? 'Guardar' : 'Crear' }}
        </button>
      </div>
    </form>
  `,
  styles: [`.full{width:100%;}`]
})
export class UserFormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<UserFormDialogComponent, UserFormData | null>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData | null
  ) {
    this.form = this.fb.group({
      name: [data?.name ?? '', [Validators.required, Validators.maxLength(255)]],
      email: [data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.ref.close({ ...(this.data ?? {}), ...this.form.value });
  }
  close(){ this.ref.close(null); }
}
