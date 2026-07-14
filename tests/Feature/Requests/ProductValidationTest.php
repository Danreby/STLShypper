<?php

namespace Tests\Feature\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_requires_core_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/produtos', [])
            ->assertSessionHasErrors(['name', 'piece_weight_g', 'print_time_h', 'labor_cost', 'extra_fixed_costs', 'quantity']);
    }

    public function test_store_rejects_quantity_below_one(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/produtos', [
                'name' => 'Miniatura',
                'piece_weight_g' => 10,
                'print_time_h' => 1,
                'labor_cost' => 0,
                'extra_fixed_costs' => 0,
                'quantity' => 0,
            ])
            ->assertSessionHasErrors(['quantity']);
    }
}
