<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title','author','genre','total_copies','available_copies'];
    public function loans(){ return $this->hasMany(Loan::class); }
}

