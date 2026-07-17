<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_product_deducts_material_stock(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create(['qtd' => 1]);

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Miniatura',
            'material_id' => $material->id,
            'piece_weight_g' => 100,
            'print_time_h' => 2,
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
            'quantity' => 2,
            'extra_material_pct' => 0,
        ])->assertRedirect();

        $this->assertEquals(0.8, (float) $material->fresh()->qtd);
    }

    public function test_updating_a_product_adjusts_the_stock_delta(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create(['qtd' => 1]);
        $product = Product::factory()->for($user)->create([
            'material_id' => $material->id,
            'piece_weight_g' => 100,
            'quantity' => 1,
            'extra_material_pct' => 0,
        ]);

        $material->decrement('qtd', 0.1);

        $this->actingAs($user)->patch("/produtos/{$product->id}", [
            'name' => $product->name,
            'material_id' => $material->id,
            'piece_weight_g' => 300,
            'print_time_h' => $product->print_time_h,
            'labor_cost' => $product->labor_cost,
            'extra_fixed_costs' => $product->extra_fixed_costs,
            'quantity' => 1,
            'extra_material_pct' => 0,
        ])->assertRedirect();

        $this->assertEquals(0.7, (float) $material->fresh()->qtd);
    }

    public function test_deleting_a_product_restores_the_stock(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create(['qtd' => 0.7]);
        $product = Product::factory()->for($user)->create([
            'material_id' => $material->id,
            'piece_weight_g' => 100,
            'quantity' => 1,
            'extra_material_pct' => 0,
        ]);

        $this->actingAs($user)->delete("/produtos/{$product->id}")->assertRedirect();

        $this->assertEquals(0.8, (float) $material->fresh()->qtd);
    }

    public function test_a_warning_is_flashed_when_stock_runs_out(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create(['qtd' => 0.1, 'name' => 'PLA Vermelho']);

        $response = $this->actingAs($user)->post('/produtos', [
            'name' => 'Miniatura',
            'material_id' => $material->id,
            'piece_weight_g' => 200,
            'print_time_h' => 2,
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
            'extra_material_pct' => 0,
        ]);

        $response->assertRedirect()->assertSessionHas('warning');
        $this->assertEquals(-0.1, (float) $material->fresh()->qtd);
    }
}
