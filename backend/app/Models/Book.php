<?php




namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

/**
 * @OA\Schema(
 *   schema="Book",
 *   required={"title","author","total_copies","available_copies"},
 *   @OA\Property(property="id", type="integer", readOnly=true),
 *   @OA\Property(property="title", type="string", example="El Quijote"),
 *   @OA\Property(property="author", type="string", example="Miguel de Cervantes"),
 *   @OA\Property(property="genre", type="string", nullable=true, example="Ficción"),
 *   @OA\Property(property="total_copies", type="integer", example=5),
 *   @OA\Property(property="available_copies", type="integer", example=3),
 *   @OA\Property(property="created_at", type="string", format="date-time"),
 *   @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

class Book extends Model
{
    use HasFactory; 

    protected $fillable = ['title','author','genre','total_copies','available_copies'];

    public function loans(){ return $this->hasMany(Loan::class); }
}
