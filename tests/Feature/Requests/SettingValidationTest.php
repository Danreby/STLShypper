<?php

namespace Tests\Feature\Requests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_requires_all_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/parametros', [])
            ->assertSessionHasErrors([
                'kwh_price', 'labor_rate', 'failure_pct', 'extra_material_pct',
                'tax_pct', 'fee_pct', 'margin_pct', 'hours_per_year',
            ]);
    }

    public function test_update_rejects_failure_pct_of_one_hundred_percent(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/parametros', [
                'kwh_price' => 0.8,
                'labor_rate' => 20,
                'failure_pct' => 1,
                'extra_material_pct' => 0.05,
                'tax_pct' => 0.06,
                'fee_pct' => 0.06,
                'margin_pct' => 0.5,
                'hours_per_year' => 1000,
            ])
            ->assertSessionHasErrors(['failure_pct']);
    }
}
