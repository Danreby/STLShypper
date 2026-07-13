<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResourceOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_printer_and_see_it_persisted(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/impressoras', [
            'name' => 'Ender 3',
            'purchase_price' => 1500,
            'useful_life_hours' => 8000,
            'power_w' => 220,
            'annual_maintenance' => 100,
        ])->assertRedirect();

        $this->assertDatabaseHas('printers', [
            'user_id' => $user->id,
            'name' => 'Ender 3',
        ]);
    }

    public function test_user_can_create_a_material_and_see_it_persisted(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/materiais', [
            'name' => 'PLA Branco',
            'type' => 'Filamento',
            'price_per_kg' => 89.9,
        ])->assertRedirect();

        $this->assertDatabaseHas('materials', [
            'user_id' => $user->id,
            'name' => 'PLA Branco',
        ]);
    }

    public function test_user_can_create_a_product_linked_to_their_own_printer_and_material(): void
    {
        $user = User::factory()->create();
        $printer = Printer::factory()->for($user)->create();
        $material = Material::factory()->for($user)->create();

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Miniatura',
            'printer_id' => $printer->id,
            'material_id' => $material->id,
            'piece_weight_g' => 20,
            'print_time_h' => 2,
            'labor_cost' => 5,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
        ])->assertRedirect();

        $this->assertDatabaseHas('products', [
            'user_id' => $user->id,
            'printer_id' => $printer->id,
            'material_id' => $material->id,
        ]);
    }

    public function test_user_cannot_view_edit_or_delete_another_users_printer(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $printer = Printer::factory()->for($owner)->create();

        $this->actingAs($intruder)
            ->patch("/impressoras/{$printer->id}", ['name' => 'Hijacked', 'purchase_price' => 1, 'useful_life_hours' => 1, 'power_w' => 1, 'annual_maintenance' => 0])
            ->assertNotFound();

        $this->actingAs($intruder)
            ->delete("/impressoras/{$printer->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('printers', ['id' => $printer->id, 'name' => $printer->name]);
    }

    public function test_user_cannot_view_edit_or_delete_another_users_material(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $material = Material::factory()->for($owner)->create();

        $this->actingAs($intruder)
            ->patch("/materiais/{$material->id}", ['name' => 'Hijacked', 'type' => 'Filamento', 'price_per_kg' => 1])
            ->assertNotFound();

        $this->actingAs($intruder)
            ->delete("/materiais/{$material->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('materials', ['id' => $material->id, 'name' => $material->name]);
    }

    public function test_user_cannot_attach_another_users_printer_or_material_to_their_own_product(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $foreignPrinter = Printer::factory()->for($owner)->create();
        $foreignMaterial = Material::factory()->for($owner)->create();

        $response = $this->actingAs($intruder)->post('/produtos', [
            'name' => 'Produto Malicioso',
            'printer_id' => $foreignPrinter->id,
            'material_id' => $foreignMaterial->id,
            'piece_weight_g' => 20,
            'print_time_h' => 2,
            'labor_cost' => 5,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
        ]);

        $response->assertSessionHasErrors(['printer_id', 'material_id']);

        $this->assertDatabaseMissing('products', [
            'user_id' => $intruder->id,
            'printer_id' => $foreignPrinter->id,
        ]);
    }

    public function test_user_cannot_view_edit_or_delete_another_users_product(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $product = Product::factory()->for($owner)->create();

        $this->actingAs($intruder)
            ->patch("/produtos/{$product->id}", [
                'name' => 'Hijacked',
                'piece_weight_g' => 1,
                'print_time_h' => 1,
                'labor_cost' => 0,
                'extra_fixed_costs' => 0,
                'quantity' => 1,
            ])
            ->assertNotFound();

        $this->actingAs($intruder)
            ->delete("/produtos/{$product->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => $product->name]);
    }
}
