import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { StatsService } from './stats.service';

@Component({
   selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  template: `
    <h2 class="visually-hidden">Panel de estadísticas</h2>

    <div class="grid" role="region" aria-label="Estadísticas generales de la biblioteca">
      <mat-card role="article" aria-label="Disponibilidad de libros">
        <h3>Disponibilidad</h3>
        <p>{{ availabilityPct }} %</p>
      </mat-card>

      <mat-card role="article" aria-label="Usuarios activos">
        <h3>Usuarios activos</h3>
        <p>{{ activeUsers }}</p>
      </mat-card>

      <mat-card role="article" aria-label="Préstamos totales">
        <h3>Préstamos totales</h3>
        <p>{{ totalLoans }}</p>
      </mat-card>
    </div>

    <section aria-label="Gráfico de préstamos por mes">
      <canvas baseChart [data]="lineData" [type]="'line'"></canvas>
    </section>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      padding: 12px;
    }

    mat-card {
      padding: 16px;
      text-align: center;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  `]

})
export class StatsDashboardComponent implements OnInit {
  availabilityPct = 0;

  lineData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ label: 'Préstamos', data: [] }],
  };

  constructor(private stats: StatsService) {}

  ngOnInit() {
    this.stats.overview().subscribe((o: any) => {
      this.availabilityPct = o.availabilityPct;
      this.lineData.labels = o.loansPerMonth.map((x: any) => x.ym);
      this.lineData.datasets[0].data = o.loansPerMonth.map((x: any) => x.total);
    });
  }
}
