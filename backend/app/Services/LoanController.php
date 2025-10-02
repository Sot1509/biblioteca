<?php

namespace App\Services;

use App\Models\Loan;

class LoanController extends Controller {
  public function __construct(private \App\Services\LoanService $service) {}

  public function index() { return Loan::with(['user','book'])->latest()->paginate(10); }

  public function store(\App\Http\Requests\StoreLoanRequest $r) {
    $d = $r->validated();
    $loan = $this->service->createLoan($d['user_id'],$d['book_id'],$d['loan_date'],$d['due_date']);
    return response()->json($loan->load(['user','book']), 201);
  }

  public function return(Loan $loan) {
    $loan = $this->service->returnLoan($loan);
    return $loan->load(['user','book']);
  }
}

