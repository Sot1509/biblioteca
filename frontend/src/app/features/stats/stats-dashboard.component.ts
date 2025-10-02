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
    <h2>Dashboard</h2>
    <div class="grid">
      <mat-card>
        <h3>Disponibilidad</h3>
        <p>{{ availabilityPct }} %</p>
      </mat-card>
    </div>
    <canvas baseChart [data]="lineData" [type]="'line'"></canvas>
  `,
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
