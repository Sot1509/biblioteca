import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service'; 

@Injectable({providedIn:'root'})
export class LoansService {
  constructor(private api: ApiService) {}
  list(params?:any){ return this.api.get<{data:any[]}>('/loans', params); }
  create(p:{user_id:number; book_id:number; loan_date:string; due_date:string}){ return this.api.post('/loans', p); }
  return(id:number){ return this.api.post(`/loans/${id}/return`, {}); }
}
