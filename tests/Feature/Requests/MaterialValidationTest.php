<?php

namespace Tests\Feature\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaterialValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_requires_name_type_and_price(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/materiais', [])
            ->assertSessionHasErrors(['name', 'type', 'price_per_kg']);
    }

    public function test_store_rejects_negative_price(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/materiais', [
                'name' => 'PLA',
                'type' => 'Filamento',
                'price_per_kg' => -1,
            ])
            ->assertSessionHasErrors(['price_per_kg']);
    }
}
