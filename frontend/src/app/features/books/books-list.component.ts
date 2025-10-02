import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BooksService } from './books.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  template: `
  <h2>Libros</h2>
  <table mat-table [dataSource]="rows">
    <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>Título</th>
      <td mat-cell *matCellDef="let r">{{r.title}}</td></ng-container>
    <ng-container matColumnDef="author"><th mat-header-cell *matHeaderCellDef>Autor</th>
      <td mat-cell *matCellDef="let r">{{r.author}}</td></ng-container>
    <ng-container matColumnDef="available"><th mat-header-cell *matHeaderCellDef>Disp.</th>
      <td mat-cell *matCellDef="let r">{{r.available_copies}} / {{r.total_copies}}</td></ng-container>
    <tr mat-header-row *matHeaderRowDef="cols"></tr>
    <tr mat-row *matRowDef="let row; columns: cols;"></tr>
  </table>
  `,
})
export class BooksListComponent implements OnInit {
  cols = ['title','author','available'];
  rows:any[] = [];
  constructor(private svc: BooksService){}
  ngOnInit(){ this.svc.list().subscribe(res => this.rows = res.data ?? res); }
}
