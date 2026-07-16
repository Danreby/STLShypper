<?php

namespace Database\Factories;

use App\Models\FilamentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FilamentType>
 */
class FilamentTypeFactory extends Factory
{
    protected $model = FilamentType::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
            'technology' => 'fdm',
            'color' => fake()->hexColor(),
        ];
    }

    public function resin(): static
    {
        return $this->state(['technology' => 'resin']);
    }
}
