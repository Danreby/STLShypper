<?php

namespace Tests\Feature;

use App\Models\FilamentType;
use App\Models\Printer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrinterFilamentTypesTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_printer_syncs_its_technology_and_filament_types(): void
    {
        $user = User::factory()->create();
        $pla = FilamentType::factory()->create(['name' => 'PLA', 'slug' => 'pla']);
        $petg = FilamentType::factory()->create(['name' => 'PETG', 'slug' => 'petg']);

        $this->actingAs($user)->post('/impressoras', [
            'name' => 'Ender 3',
            'technology' => 'fdm',
            'filament_type_ids' => [$pla->id, $petg->id],
            'purchase_price' => 1200,
            'useful_life_hours' => 8000,
            'power_w' => 200,
            'annual_maintenance' => 100,
        ])->assertRedirect();

        $printer = Printer::where('user_id', $user->id)->firstOrFail();

        $this->assertSame('fdm', $printer->technology->value);
        $this->assertEqualsCanonicalizing([$pla->id, $petg->id], $printer->filamentTypes()->pluck('filament_types.id')->all());
    }

    public function test_updating_a_printer_resyncs_its_filament_types(): void
    {
        $user = User::factory()->create();
        $pla = FilamentType::factory()->create(['name' => 'PLA', 'slug' => 'pla']);
        $petg = FilamentType::factory()->create(['name' => 'PETG', 'slug' => 'petg']);
        $tpu = FilamentType::factory()->create(['name' => 'TPU', 'slug' => 'tpu']);

        $printer = Printer::factory()->for($user)->create(['technology' => 'fdm']);
        $printer->filamentTypes()->sync([$pla->id, $petg->id]);

        $this->actingAs($user)->patch("/impressoras/{$printer->id}", [
            'name' => $printer->name,
            'technology' => 'fdm',
            'filament_type_ids' => [$petg->id, $tpu->id],
            'purchase_price' => $printer->purchase_price,
            'useful_life_hours' => $printer->useful_life_hours,
            'power_w' => $printer->power_w,
            'annual_maintenance' => $printer->annual_maintenance,
        ])->assertRedirect();

        $this->assertEqualsCanonicalizing(
            [$petg->id, $tpu->id],
            $printer->filamentTypes()->pluck('filament_types.id')->all()
        );
    }

    public function test_store_rejects_an_unknown_filament_type_id(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/impressoras', [
            'name' => 'Ender 3',
            'technology' => 'fdm',
            'filament_type_ids' => [99999],
            'purchase_price' => 1200,
            'useful_life_hours' => 8000,
            'power_w' => 200,
            'annual_maintenance' => 100,
        ])->assertSessionHasErrors(['filament_type_ids.0']);

        $this->assertDatabaseMissing('printers', ['user_id' => $user->id]);
    }

    public function test_store_rejects_an_invalid_technology_value(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/impressoras', [
            'name' => 'Ender 3',
            'technology' => 'laser',
            'purchase_price' => 1200,
            'useful_life_hours' => 8000,
            'power_w' => 200,
            'annual_maintenance' => 100,
        ])->assertSessionHasErrors(['technology']);
    }
}
