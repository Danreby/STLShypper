<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompositeProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_composite_product_stores_its_parts(): void
    {
        $user = User::factory()->create();
        $printer = Printer::factory()->for($user)->create();
        $head = Material::factory()->for($user)->create();
        $legs = Material::factory()->for($user)->create();

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Action Figure',
            'labor_cost' => 5,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
            'parts' => [
                ['name' => 'Cabeça', 'printer_id' => $printer->id, 'material_id' => $head->id, 'piece_weight_g' => 10, 'print_time_h' => 2, 'quantity_per_unit' => 1],
                ['name' => 'Pernas', 'printer_id' => $printer->id, 'material_id' => $legs->id, 'piece_weight_g' => 5, 'print_time_h' => 4, 'quantity_per_unit' => 2],
            ],
        ])->assertRedirect();

        $product = Product::where('user_id', $user->id)->firstOrFail();

        $this->assertCount(2, $product->parts);
        $this->assertEquals(['Cabeça', 'Pernas'], $product->parts->pluck('name')->all());
        $this->assertSame(2, $product->parts->firstWhere('name', 'Pernas')->quantity_per_unit);
    }

    public function test_store_does_not_require_piece_weight_when_composite(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Action Figure',
            'labor_cost' => 5,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
            'parts' => [
                ['name' => 'Cabeça', 'piece_weight_g' => 10, 'print_time_h' => 2],
            ],
        ])->assertSessionDoesntHaveErrors(['piece_weight_g', 'print_time_h']);
    }

    public function test_store_still_requires_piece_weight_when_not_composite(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Miniatura',
            'labor_cost' => 5,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
        ])->assertSessionHasErrors(['piece_weight_g', 'print_time_h']);
    }

    public function test_updating_a_composite_product_replaces_its_parts(): void
    {
        $user = User::factory()->create();
        $printer = Printer::factory()->for($user)->create();
        $material = Material::factory()->for($user)->create();
        $product = Product::factory()->for($user)->create();
        $product->parts()->create(['name' => 'Antiga', 'piece_weight_g' => 1, 'print_time_h' => 1, 'quantity_per_unit' => 1]);

        $this->actingAs($user)->patch("/produtos/{$product->id}", [
            'name' => $product->name,
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
            'parts' => [
                ['name' => 'Nova', 'printer_id' => $printer->id, 'material_id' => $material->id, 'piece_weight_g' => 20, 'print_time_h' => 3, 'quantity_per_unit' => 1],
            ],
        ])->assertRedirect();

        $product->refresh();
        $this->assertCount(1, $product->parts);
        $this->assertSame('Nova', $product->parts->first()->name);
    }

    public function test_creating_a_composite_product_deducts_stock_for_each_parts_material(): void
    {
        $user = User::factory()->create();
        $head = Material::factory()->for($user)->create(['qtd' => 1]);
        $legs = Material::factory()->for($user)->create(['qtd' => 1]);

        $this->actingAs($user)->post('/produtos', [
            'name' => 'Action Figure',
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
            'quantity' => 1,
            'parts' => [
                ['name' => 'Cabeça', 'material_id' => $head->id, 'piece_weight_g' => 100, 'print_time_h' => 1, 'quantity_per_unit' => 1],
                ['name' => 'Pernas', 'material_id' => $legs->id, 'piece_weight_g' => 50, 'print_time_h' => 1, 'quantity_per_unit' => 2],
            ],
        ])->assertRedirect();

        // extra_material_pct padrão é 5%, então: 100*1.05/1000 = 0.105kg, arredondado para 0.11kg de cada material.
        $this->assertEquals(0.89, (float) $head->fresh()->qtd);
        // 50*2 = 100g -> mesma matemática que a cabeça.
        $this->assertEquals(0.89, (float) $legs->fresh()->qtd);
    }

    public function test_deleting_a_composite_product_restores_stock_for_each_part(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create(['qtd' => 0.5]);
        $product = Product::factory()->for($user)->create(['quantity' => 1]);
        $product->parts()->create([
            'name' => 'Cabeça', 'material_id' => $material->id, 'piece_weight_g' => 100, 'print_time_h' => 1, 'quantity_per_unit' => 1,
        ]);

        $this->actingAs($user)->delete("/produtos/{$product->id}")->assertRedirect();

        $this->assertEquals(0.61, (float) $material->fresh()->qtd);
    }
}
