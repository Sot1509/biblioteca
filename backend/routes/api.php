<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\StatsController;

Route::apiResource('books', BookController::class);

Route::apiResource('users', UserController::class)
    ->only(['index','store','show','update','destroy']);

Route::get('loans', [LoanController::class, 'index'])->name('loans.index');

Route::post('loans', [LoanController::class, 'store'])->name('loans.store');


Route::post('loans/{loan}/return', [LoanController::class, 'return'])
    ->whereNumber('loan')
    ->name('loans.return');

Route::get('stats/overview', [StatsController::class, 'overview'])->name('stats.overview');
