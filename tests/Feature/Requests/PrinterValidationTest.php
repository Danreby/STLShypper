<?php

namespace Tests\Feature\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrinterValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_requires_all_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/impressoras', [])
            ->assertSessionHasErrors(['name', 'technology', 'purchase_price', 'useful_life_hours', 'power_w', 'annual_maintenance']);
    }

    public function test_store_rejects_zero_useful_life_hours(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/impressoras', [
                'name' => 'Ender 3',
                'technology' => 'fdm',
                'purchase_price' => 1000,
                'useful_life_hours' => 0,
                'power_w' => 200,
                'annual_maintenance' => 100,
            ])
            ->assertSessionHasErrors(['useful_life_hours']);
    }
}
