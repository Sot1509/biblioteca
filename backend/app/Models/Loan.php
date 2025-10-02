<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @OA\Schema(
 *   schema="Loan",
 *   required={"user_id","book_id","loan_date","due_date","status"},
 *   @OA\Property(property="id", type="integer", readOnly=true),
 *   @OA\Property(property="user_id", type="integer", example=1),
 *   @OA\Property(property="book_id", type="integer", example=10),
 *   @OA\Property(property="loan_date", type="string", format="date", example="2025-10-01"),
 *   @OA\Property(property="due_date", type="string", format="date", example="2025-10-08"),
 *   @OA\Property(property="return_date", type="string", format="date", nullable=true),
 *   @OA\Property(property="status", type="string", example="active")
 * )
 */
class Loan extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','book_id','loan_date','due_date','return_date','status'];

    public function user(){ return $this->belongsTo(User::class); }
    public function book(){ return $this->belongsTo(Book::class); }
}
