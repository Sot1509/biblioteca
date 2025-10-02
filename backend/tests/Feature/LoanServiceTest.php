<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\{Book, User, Loan};
use App\Services\LoanService;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

it('crea un préstamo y decrementa disponibilidad', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create(['total_copies' => 3, 'available_copies' => 3]);

    $svc = app(LoanService::class);

    $loan = $svc->createLoan(
        $user->id,
        $book->id,
        now()->toDateString(),
        now()->addDays(7)->toDateString()
    );

    expect($loan)->toBeInstanceOf(Loan::class);
    $book->refresh();
    expect($book->available_copies)->toBe(2);
});

it('lanza error si no hay copias disponibles', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create(['total_copies' => 0, 'available_copies' => 0]);

    $svc = app(LoanService::class);

    $svc->createLoan(
        $user->id,
        $book->id,
        now()->toDateString(),
        now()->addDays(7)->toDateString()
    );
})->throws(ValidationException::class);

it('devuelve préstamo y vuelve a incrementar disponibilidad', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create(['total_copies' => 1, 'available_copies' => 1]);

    $svc  = app(LoanService::class);

    $loan = $svc->createLoan(
        $user->id,
        $book->id,
        now()->toDateString(),
        now()->addDays(7)->toDateString()
    );

    $svc->returnLoan($loan->fresh());

    $loan->refresh();
    $book->refresh();

    expect($loan->status)->toBe('returned');
    expect($book->available_copies)->toBe(1);
});
