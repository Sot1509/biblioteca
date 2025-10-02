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
  $total = $this->faker->numberBetween(1, 10);
        $available = $this->faker->numberBetween(0, $total);
        return [
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'genre' => $this->faker->randomElement(['Ficción','Historia','Ciencia','Infantil', null]),
            'total_copies' => $total,
            'available_copies' => $available,
        ];
}

}
