<?php

namespace Tests\Unit\Services;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\User;
use App\Services\PricingCalculator;
use App\Services\UserSettingsResolver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricingCalculatorCompositeTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_sums_material_energy_and_machine_cost_across_all_parts(): void
    {
        $user = User::factory()->create();
        $settings = (new UserSettingsResolver())->forUser($user);
        $settings->update([
            'kwh_price' => 1,
            'failure_pct' => 0,
            'extra_material_pct' => 0,
            'tax_pct' => 0,
            'fee_pct' => 0,
            'margin_pct' => 0,
            'hours_per_year' => 1000,
        ]);

        // Custo de depreciação por hora = 1 (1000/1000); potência 1000W + kwh_price 1 => energia por hora = 1.
        $printer = Printer::factory()->for($user)->create([
            'purchase_price' => 1000,
            'useful_life_hours' => 1000,
            'annual_maintenance' => 0,
            'power_w' => 1000,
        ]);
        // Preço por kg = 1000 => custo de material = peso em gramas, 1:1.
        $material = Material::factory()->for($user)->create(['price_per_kg' => 1000]);

        $product = Product::factory()->for($user)->create([
            'quantity' => 1,
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
        ]);

        $product->parts()->createMany([
            ['name' => 'Cabeça', 'printer_id' => $printer->id, 'material_id' => $material->id, 'piece_weight_g' => 10, 'print_time_h' => 2, 'quantity_per_unit' => 1],
            ['name' => 'Pernas', 'printer_id' => $printer->id, 'material_id' => $material->id, 'piece_weight_g' => 5, 'print_time_h' => 4, 'quantity_per_unit' => 2],
        ]);

        $pricing = PricingCalculator::calculateForProduct($product->fresh(), $settings);

        // Peso por unidade: (10*1) + (5*2) = 20g. Tempo total: 2 + 4 = 6h.
        $this->assertSame(20.0, $pricing['total_weight_g']);
        $this->assertSame(6.0, $pricing['print_time_total_h']);
        $this->assertSame(20.0, $pricing['material_cost']);
        $this->assertSame(6.0, $pricing['energy_cost']);
        $this->assertSame(6.0, $pricing['machine_cost']);
        $this->assertSame(32.0, $pricing['subtotal_cost']);
        $this->assertSame(32.0, $pricing['cost_with_losses']);
        $this->assertSame(32.0, $pricing['suggested_price_per_unit']);

        // Custo individual de cada parte (usado no painel de abas do modal de detalhes).
        $head = $product->parts->firstWhere('name', 'Cabeça');
        $legs = $product->parts->firstWhere('name', 'Pernas');
        $breakdown = collect($pricing['parts_breakdown'])->keyBy('id');

        $this->assertSame(14.0, $breakdown[$head->id]['cost']);
        $this->assertSame(10.0, $breakdown[$head->id]['material_cost']);
        $this->assertSame(2.0, $breakdown[$head->id]['energy_cost']);
        $this->assertSame(2.0, $breakdown[$head->id]['machine_cost']);

        $this->assertSame(18.0, $breakdown[$legs->id]['cost']);
    }

    public function test_a_simple_product_has_an_empty_parts_breakdown(): void
    {
        $user = User::factory()->create();
        $settings = (new UserSettingsResolver())->forUser($user);
        $product = Product::factory()->for($user)->create();

        $pricing = PricingCalculator::calculateForProduct($product, $settings);

        $this->assertSame([], $pricing['parts_breakdown']);
    }

    public function test_part_print_time_is_shared_across_the_order_quantity(): void
    {
        $user = User::factory()->create();
        $settings = (new UserSettingsResolver())->forUser($user);
        $settings->update([
            'kwh_price' => 1,
            'failure_pct' => 0,
            'extra_material_pct' => 0,
            'tax_pct' => 0,
            'fee_pct' => 0,
            'margin_pct' => 0,
            'hours_per_year' => 1000,
        ]);

        $printer = Printer::factory()->for($user)->create([
            'purchase_price' => 1000,
            'useful_life_hours' => 1000,
            'annual_maintenance' => 0,
            'power_w' => 1000,
        ]);
        $material = Material::factory()->for($user)->create(['price_per_kg' => 1000]);

        $product = Product::factory()->for($user)->create([
            'quantity' => 2,
            'labor_cost' => 0,
            'extra_fixed_costs' => 0,
        ]);

        $product->parts()->createMany([
            ['name' => 'Cabeça', 'printer_id' => $printer->id, 'material_id' => $material->id, 'piece_weight_g' => 10, 'print_time_h' => 2, 'quantity_per_unit' => 1],
            ['name' => 'Pernas', 'printer_id' => $printer->id, 'material_id' => $material->id, 'piece_weight_g' => 5, 'print_time_h' => 4, 'quantity_per_unit' => 2],
        ]);

        $pricing = PricingCalculator::calculateForProduct($product->fresh(), $settings);

        // Peso por unidade continua 20g (não depende da quantidade do pedido).
        // Tempo por unidade agora é (2+4)/2 = 3h -> energia e máquina por unidade = 3.
        $this->assertSame(20.0, $pricing['material_cost']);
        $this->assertSame(3.0, $pricing['energy_cost']);
        $this->assertSame(3.0, $pricing['machine_cost']);
        $this->assertSame(26.0, $pricing['cost_with_losses']);
        $this->assertSame(52.0, $pricing['total_price']);
    }

    public function test_a_product_without_parts_still_uses_the_simple_single_job_calculation(): void
    {
        $user = User::factory()->create();
        $settings = (new UserSettingsResolver())->forUser($user);

        $printer = Printer::factory()->for($user)->create();
        $material = Material::factory()->for($user)->create();
        $product = Product::factory()->for($user)->create([
            'printer_id' => $printer->id,
            'material_id' => $material->id,
        ]);

        $pricing = PricingCalculator::calculateForProduct($product, $settings);

        $this->assertGreaterThan(0, $pricing['suggested_price_per_unit']);
    }
}
