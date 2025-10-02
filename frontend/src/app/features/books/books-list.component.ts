// src/app/features/books/books-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { BooksService } from './books.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule],
  template: `
    <h2 class="visually-hidden">Listado de libros</h2>

    <div class="table-wrap" role="region" aria-label="Tabla de libros">
      <table mat-table [dataSource]="data" matSort class="mat-elevation-z8"
             aria-label="Libros disponibles">

        <!-- Título -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header aria-sort="none" scope="col">
            Título
          </th>
          <td mat-cell *matCellDef="let r">{{ r.title }}</td>
        </ng-container>

        <!-- Autor -->
        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef mat-sort-header scope="col">
            Autor
          </th>
          <td mat-cell *matCellDef="let r">{{ r.author }}</td>
        </ng-container>

        <!-- Disponibilidad -->
        <ng-container matColumnDef="available">
          <th mat-header-cell *matHeaderCellDef scope="col">Disp.</th>
          <td mat-cell *matCellDef="let r">
            {{ r.available_copies }} / {{ r.total_copies }}
          </td>
        </ng-container>

        <!-- Acciones -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef scope="col" class="sr-only">Acciones</th>
          <td mat-cell *matCellDef="let r">
            <button mat-button color="primary"
                    aria-label="Editar libro {{ r.title }}"
                    tabindex="0">
              Editar
            </button>
            <button mat-button color="warn"
                    aria-label="Eliminar libro {{ r.title }}"
                    tabindex="0">
              Eliminar
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-wrap { overflow:auto; }
    table { width:100%; min-width: 600px; }
    .sr-only, .visually-hidden {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); border: 0;
    }

    /* Responsive simple con Grid para contenedores alrededor de la tabla */
    @media (max-width: 768px) {
      table { min-width: 0; }
    }
  `]
})
export class BooksListComponent implements OnInit {
  cols = ['title', 'author', 'available', 'actions'];
  data = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private svc: BooksService) {}

  ngOnInit() {
    this.svc.list().subscribe({
      next: (res) => {
        const rows = (res as any)?.data ?? (res as any);
        this.data.data = rows;
        // setTimeout para asegurar el ViewChild ya montado
        setTimeout(() => this.data.sort = this.sort);
      }
    });
  }
}
