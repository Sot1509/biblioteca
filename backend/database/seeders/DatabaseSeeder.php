<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User,Book,Loan};

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('prueba123'),
        ]);

        Book::factory()->count(25)->create();

        // Algunos préstamos activos
        Loan::factory()->count(8)->create();

        // Simula devueltos
        Loan::factory()->count(5)->create([
            'return_date' => now()->subDays(rand(1, 15))->format('Y-m-d'),
            'status' => 'returned',
        ]);
    }
}
