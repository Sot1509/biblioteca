<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');                   // título del libro
            $table->string('author');                  // autor del libro
            $table->string('genre')->nullable();       // género, puede ser nulo
            $table->unsignedInteger('total_copies')->default(1);      // total de copias
            $table->unsignedInteger('available_copies')->default(1);  // copias disponibles
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
