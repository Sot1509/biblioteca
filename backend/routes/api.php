<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\AuthController;


Route::get('stats/overview', [StatsController::class, 'overview']);
Route::apiResource('books', BookController::class);
Route::apiResource('users', UserController::class);
Route::get('loans', [LoanController::class, 'index']);
Route::post('loans', [LoanController::class, 'store']);
Route::post('loans/{loan}/return', [LoanController::class, 'return']);



