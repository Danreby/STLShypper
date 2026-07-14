<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_export_endpoint_returns_full_payload_for_the_authenticated_user(): void
    {
        $user = User::factory()->create();
        $printer = Printer::factory()->for($user)->create();
        $material = Material::factory()->for($user)->create();
        $product = Product::factory()->for($user)->create([
            'printer_id' => $printer->id,
            'material_id' => $material->id,
            'quantity' => 3,
        ]);

        $response = $this->actingAs($user)->getJson('/exportar');

        $response->assertOk();
        $response->assertJsonStructure([
            'settings' => ['kwh_price', 'labor_rate', 'failure_pct', 'extra_material_pct', 'tax_pct', 'fee_pct', 'margin_pct', 'hours_per_year'],
            'printers' => [['id', 'name', 'depreciation_per_hour', 'maintenance_per_hour', 'total_cost_per_hour']],
            'materials' => [['id', 'name', 'price_per_kg', 'price_per_gram']],
            'products' => [['id', 'name', 'pricing']],
            'summary' => ['products_count', 'total_quantity', 'total_cost', 'total_revenue', 'total_profit', 'margin_pct'],
        ]);

        $response->assertJsonPath('summary.products_count', 1);
        $response->assertJsonPath('summary.total_quantity', 3);
        $response->assertJsonPath('products.0.id', $product->id);
        $response->assertJsonPath('printers.0.id', $printer->id);
    }

    public function test_export_endpoint_only_includes_the_authenticated_users_data(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        Printer::factory()->for($owner)->create();
        Product::factory()->for($owner)->create();

        $response = $this->actingAs($intruder)->getJson('/exportar');

        $response->assertOk();
        $response->assertJsonPath('printers', []);
        $response->assertJsonPath('products', []);
        $response->assertJsonPath('summary.products_count', 0);
    }

    public function test_export_endpoint_requires_authentication(): void
    {
        $this->getJson('/exportar')->assertUnauthorized();
    }
}
