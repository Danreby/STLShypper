<?php

namespace Tests\Unit\Policies;

use App\Models\Printer;
use App\Models\User;
use App\Policies\PrinterPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrinterPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_and_delete(): void
    {
        $owner = User::factory()->create();
        $printer = Printer::factory()->for($owner)->create();
        $policy = new PrinterPolicy();

        $this->assertTrue($policy->update($owner, $printer));
        $this->assertTrue($policy->delete($owner, $printer));
    }

    public function test_non_owner_cannot_update_or_delete(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $printer = Printer::factory()->for($owner)->create();
        $policy = new PrinterPolicy();

        $this->assertFalse($policy->update($intruder, $printer));
        $this->assertFalse($policy->delete($intruder, $printer));
    }
}
