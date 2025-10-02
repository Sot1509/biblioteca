import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/api.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private api = inject(ApiService);
  overview() { return this.api.get<any>('stats/overview'); }
}
