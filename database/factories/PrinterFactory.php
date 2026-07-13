<?php

namespace Database\Factories;

use App\Models\Printer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Printer>
 */
class PrinterFactory extends Factory
{
    protected $model = Printer::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(2, true),
            'purchase_price' => fake()->randomFloat(2, 500, 10000),
            'useful_life_hours' => fake()->numberBetween(2000, 15000),
            'power_w' => fake()->numberBetween(100, 400),
            'annual_maintenance' => fake()->randomFloat(2, 0, 1000),
        ];
    }
}
