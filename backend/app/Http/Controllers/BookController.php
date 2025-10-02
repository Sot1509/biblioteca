<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookController extends Controller {
  public function index(){ 
      return Book::query()->latest()->paginate(10); 
  }

  public function store(StoreBookRequest $r){ 
      return response()->json(Book::create($r->validated()), 201); 
  }

  public function show(Book $book){ 
      return $book; 
  }

  public function update(UpdateBookRequest $r, Book $book){ 
      $book->update($r->validated()); 
      return $book; 
  }

  public function destroy(Book $book){ 
      $book->delete(); 
      return response()->noContent(); 
  }
}

