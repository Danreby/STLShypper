<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductPdfTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_download_the_product_quote_pdf(): void
    {
        $user = User::factory()->create();
        $printer = Printer::factory()->for($user)->create();
        $material = Material::factory()->for($user)->create();
        $product = Product::factory()->for($user)->create([
            'printer_id' => $printer->id,
            'material_id' => $material->id,
        ]);

        $response = $this->actingAs($user)->get("/produtos/{$product->id}/pdf");

        $response->assertOk();
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
    }

    public function test_a_user_cannot_download_another_users_product_quote(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $product = Product::factory()->for($owner)->create();

        $this->actingAs($intruder)->get("/produtos/{$product->id}/pdf")->assertNotFound();
    }
}
