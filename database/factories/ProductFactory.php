<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'printer_id' => null,
            'material_id' => null,
            'name' => fake()->words(3, true),
            'piece_weight_g' => fake()->randomFloat(2, 5, 500),
            'print_time_h' => fake()->randomFloat(2, 0.5, 20),
            'labor_cost' => fake()->randomFloat(2, 0, 50),
            'extra_fixed_costs' => fake()->randomFloat(2, 0, 20),
            'quantity' => 1,
            'extra_material_pct' => null,
            'failure_pct' => null,
            'tax_pct' => null,
            'fee_pct' => null,
            'margin_pct' => null,
        ];
    }
}
