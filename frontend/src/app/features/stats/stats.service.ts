// src/app/features/stats/stats.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private api: ApiService) {}

  overview() {
    return this.api.get('/stats/overview');
  }
}
