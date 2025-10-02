<?php

namespace App\Services;

use App\Models\{Book, Loan};
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LoanService {
  public function createLoan(int $userId, int $bookId, string $loanDate, string $dueDate): Loan {
    return DB::transaction(function() use ($userId,$bookId,$loanDate,$dueDate){
      $book = Book::lockForUpdate()->findOrFail($bookId);
      if ($book->available_copies < 1) {
        throw ValidationException::withMessages(['book_id' => 'No hay copias disponibles.']);
      }
      $loan = Loan::create([
        'user_id'=>$userId,'book_id'=>$bookId,
        'loan_date'=>$loanDate,'due_date'=>$dueDate,'status'=>'active'
      ]);
      $book->decrement('available_copies');
      return $loan;
    });
  }

  public function returnLoan(Loan $loan): Loan {
    return DB::transaction(function() use ($loan){
      if ($loan->status === 'returned') return $loan;
      $loan->update(['status'=>'returned','return_date'=>now()->toDateString()]);
      $loan->book()->lockForUpdate()->first()->increment('available_copies');
      return $loan;
    });
  }
}

