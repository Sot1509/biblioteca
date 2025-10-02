import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ToastService } from '../../core/toast.service';
import { BooksService, Book } from './books.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    
  ],
  template: `
  <mat-card>
    <div class="toolbar">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Buscar (título/autor)</mat-label>
        <input matInput [(ngModel)]="q" (keyup.enter)="reload()" placeholder="El Quijote, García Márquez..." />
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="reload()">
        <mat-icon>search</mat-icon> Buscar
      </button>
      <button mat-button (click)="clear()">Limpiar</button>

      <span class="spacer"></span>

      <button mat-stroked-button (click)="exportCsv()">
        <mat-icon>download</mat-icon>&nbsp;Exportar CSV
      </button>
    </div>

    <div class="table-wrap" *ngIf="!loading(); else loadingTpl">
      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)">

        <!-- ID -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="id">ID</th>
          <td mat-cell *matCellDef="let b">{{ b.id }}</td>
        </ng-container>

        <!-- Title -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="title">Título</th>
          <td mat-cell *matCellDef="let b">{{ b.title }}</td>
        </ng-container>

        <!-- Author -->
        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="author">Autor</th>
          <td mat-cell *matCellDef="let b">{{ b.author }}</td>
        </ng-container>

        <!-- Genre -->
        <ng-container matColumnDef="genre">
          <th mat-header-cell *matHeaderCellDef>Género</th>
          <td mat-cell *matCellDef="let b">{{ b.genre || '—' }}</td>
        </ng-container>

        <!-- Copies -->
        <ng-container matColumnDef="copies">
          <th mat-header-cell *matHeaderCellDef>Copias</th>
          <td mat-cell *matCellDef="let b">{{ b.available_copies }} / {{ b.total_copies }}</td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let b">
            <button mat-icon-button color="warn" (click)="remove(b)" aria-label="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colsWithActions"></tr>
        <tr mat-row *matRowDef="let row; columns: colsWithActions;"></tr>
      </table>

      <mat-paginator
        [length]="total"
        [pageIndex]="page-1"
        [pageSize]="perPage"
        [pageSizeOptions]="[5,10,20]"
        (page)="onPage($event)">
      </mat-paginator>
    </div>

    <ng-template #loadingTpl>
      <div class="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>
    </ng-template>
  </mat-card>
  `,
  styles: [`
    .toolbar { display:flex; gap:12px; align-items:center; padding:8px; flex-wrap:wrap; }
    .spacer { flex:1 1 auto; }
    .table-wrap { overflow:auto; }
    table { width: 100%; }
    mat-card { margin: 12px; }
    .loading { display:grid; place-items:center; height:240px; }
  `]
})
export class BooksListComponent implements OnInit {
  private svc = inject(BooksService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  cols = ['id', 'title', 'author', 'genre', 'copies'];
  get colsWithActions() { return [...this.cols, 'actions']; }

  dataSource = new MatTableDataSource<Book>([]);
  total = 0;

  // estado
  page = 1;
  perPage = 10;
  sort: string | undefined;
  order: 'asc'|'desc'|undefined;

  q = '';
  loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sortRef!: MatSort;

  ngOnInit() { this.reload(); }

  onPage(e: any) {
    this.page = e.pageIndex + 1;
    this.perPage = e.pageSize;
    this.reload();
  }

  onSort(e: Sort) {
    this.sort = e.direction ? e.active : undefined;
    this.order = e.direction || undefined;
    this.reload();
  }

  clear() {
    this.q = '';
    this.page = 1;
    this.sort = undefined;
    this.order = undefined;
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.svc.list({
      page: this.page,
      perPage: this.perPage,
      q: this.q || undefined,
      sort: this.sort,
      order: this.order
    }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data ?? [];
        this.total = res.total ?? res.data?.length ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  remove(row: Book) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar libro', message: `¿Eliminar "${row.title}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.svc.remove(row.id).subscribe({
        next: () => { this.toast.ok('Libro eliminado'); this.reload(); },
        error: () => { /* el interceptor ya muestra error */ }
      });
    });
  }

  exportCsv() {
    const header = ['id','title','author','genre','total_copies','available_copies'];
    const rows = (this.dataSource.data || []).map(b => [
      b.id, b.title, b.author, b.genre ?? '', b.total_copies, b.available_copies
    ]);
    const csv = [header, ...rows].map(r => r.map(escapeCsv).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'libros.csv'; a.click();
    URL.revokeObjectURL(url);

    function escapeCsv(v: any) {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    }
  }
}
