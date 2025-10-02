<?php

namespace Database\Factories;

use App\Models\{Loan,User,Book};
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        $loan = $this->faker->dateTimeBetween('-2 months', 'now');
        $due = (clone $loan)->modify('+7 days');

        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'loan_date' => $loan->format('Y-m-d'),
            'due_date' => $due->format('Y-m-d'),
            'return_date' => null,
            'status' => 'active',
        ];
    }
}
