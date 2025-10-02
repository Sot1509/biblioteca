import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service'; 

@Injectable({ providedIn:'root' })
export class BooksService {
  constructor(private api: ApiService) {}

  // GET /api/books?params
  list(params?: any) {
    return this.api.get<{ data: any[] }>('/books', params);
  }

  // POST /api/books
  create(payload: any) {
    return this.api.post('/books', payload);
  }

  // PUT /api/books/{id}
  update(id: number, payload: any) {
    return this.api.put(`/books/${id}`, payload);
  }

  // DELETE /api/books/{id}
  remove(id: number) {
    return this.api.delete(`/books/${id}`);
  }
}
