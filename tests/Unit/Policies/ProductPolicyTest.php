<?php

namespace Tests\Unit\Policies;

use App\Models\Product;
use App\Models\User;
use App\Policies\ProductPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_and_delete(): void
    {
        $owner = User::factory()->create();
        $product = Product::factory()->for($owner)->create();
        $policy = new ProductPolicy();

        $this->assertTrue($policy->update($owner, $product));
        $this->assertTrue($policy->delete($owner, $product));
    }

    public function test_non_owner_cannot_update_or_delete(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $product = Product::factory()->for($owner)->create();
        $policy = new ProductPolicy();

        $this->assertFalse($policy->update($intruder, $product));
        $this->assertFalse($policy->delete($intruder, $product));
    }
}
