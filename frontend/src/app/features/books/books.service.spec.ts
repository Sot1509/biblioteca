// src/app/features/books/books.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BooksService } from './books.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api.service';
import { HttpClient } from '@angular/common/http';

describe('BooksService', () => {
  let service: BooksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BooksService,
        ApiService,
        HttpClient
      ]
    });
    service = TestBed.inject(BooksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list() debe llamar GET /books', () => {
    const mock = { data: [{ id: 1, title: 'A', author: 'B' }] };

    service.list().subscribe(res => {
      expect((res as any).data.length).toBe(1);
      expect((res as any).data[0].title).toBe('A');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/books`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create() debe llamar POST /books', () => {
    const payload = { title: 'Nuevo', author: 'Yo', total_copies: 2, available_copies: 2 };
    service.create(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/books`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload });
  });
});
