<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition() {
  $total = fake()->numberBetween(1,10);
  return [
    'title'=>fake()->sentence(3),
    'author'=>fake()->name(),
    'genre'=>fake()->randomElement(['Ficción','No Ficción','Ciencia','Historia']),
    'total_copies'=>$total,
    'available_copies'=>$total,
  ];
}

}
