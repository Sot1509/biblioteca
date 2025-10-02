import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from './users.service';
import { UserFormDialogComponent, UserFormData } from './user-form-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h2>Usuarios</h2>
      <button mat-raised-button color="primary" (click)="openCreate()">Nuevo</button>
    </div>

    <table mat-table [dataSource]="rows" class="mat-elevation-z1" style="width:100%">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let r">{{ r.name }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let r">{{ r.email }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let r">
          <button mat-stroked-button color="primary" (click)="openEdit(r)">Editar</button>
          <button mat-stroked-button color="warn" (click)="remove(r)" style="margin-left:8px;">Eliminar</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>
  `,
})
export class UsersListComponent implements OnInit {
  private svc = inject(UsersService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  cols = ['name','email','actions'];
  rows: any[] = [];

  ngOnInit(): void { this.load(); }

  load() {
    this.svc.list({ per_page: 1000 }).subscribe((res: any) => {
      this.rows = res?.data ?? res ?? [];
    });
  }

  openCreate() {
    this.dialog.open(UserFormDialogComponent, { data: null, width: '520px' })
      .afterClosed().subscribe((form: UserFormData | null) => {
        if (!form) return;
        this.svc.create(form).subscribe({
          next: () => { this.snack.open('Usuario creado', 'OK', { duration: 2000 }); this.load(); },
          error: (e) => this.snack.open(e?.error?.message || 'Error al crear', 'Cerrar', { duration: 3000 })
        });
      });
  }

  openEdit(row: any) {
    this.dialog.open(UserFormDialogComponent, { data: row, width: '520px' })
      .afterClosed().subscribe((form: UserFormData | null) => {
        if (!form) return;
        this.svc.update(row.id, form).subscribe({
          next: () => { this.snack.open('Usuario actualizado', 'OK', { duration: 2000 }); this.load(); },
          error: (e) => this.snack.open(e?.error?.message || 'Error al actualizar', 'Cerrar', { duration: 3000 })
        });
      });
  }

  remove(row: any) {
    if (!confirm(`¿Eliminar "${row.name || row.email}"?`)) return;
    this.svc.remove(row.id).subscribe({
      next: () => { this.snack.open('Usuario eliminado', 'OK', { duration: 2000 }); this.load(); },
      error: (e) => this.snack.open(e?.error?.message || 'Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
