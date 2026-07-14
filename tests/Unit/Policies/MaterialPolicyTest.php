<?php

namespace Tests\Unit\Policies;

use App\Models\Material;
use App\Models\User;
use App\Policies\MaterialPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaterialPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_and_delete(): void
    {
        $owner = User::factory()->create();
        $material = Material::factory()->for($owner)->create();
        $policy = new MaterialPolicy();

        $this->assertTrue($policy->update($owner, $material));
        $this->assertTrue($policy->delete($owner, $material));
    }

    public function test_non_owner_cannot_update_or_delete(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $material = Material::factory()->for($owner)->create();
        $policy = new MaterialPolicy();

        $this->assertFalse($policy->update($intruder, $material));
        $this->assertFalse($policy->delete($intruder, $material));
    }
}
