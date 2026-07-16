<?php

namespace Database\Seeders;

use App\Models\FilamentType;
use Illuminate\Database\Seeder;

class FilamentTypeSeeder extends Seeder
{
    /**
     * Catálogo dos principais tipos de filamento (FDM) e resina (SLA/DLP/LCD)
     * que uma impressora pode aceitar. Referência global, compartilhada entre usuários.
     */
    public function run(): void
    {
        $types = [
            // Filamentos (FDM)
            ['name' => 'PLA', 'slug' => 'pla', 'technology' => 'fdm', 'color' => '#22c55e'],
            ['name' => 'PLA+', 'slug' => 'pla-plus', 'technology' => 'fdm', 'color' => '#16a34a'],
            ['name' => 'PETG', 'slug' => 'petg', 'technology' => 'fdm', 'color' => '#06b6d4'],
            ['name' => 'ABS', 'slug' => 'abs', 'technology' => 'fdm', 'color' => '#f97316'],
            ['name' => 'ASA', 'slug' => 'asa', 'technology' => 'fdm', 'color' => '#ea580c'],
            ['name' => 'TPU Flexível', 'slug' => 'tpu', 'technology' => 'fdm', 'color' => '#a855f7'],
            ['name' => 'Nylon (PA)', 'slug' => 'nylon', 'technology' => 'fdm', 'color' => '#64748b'],
            ['name' => 'Policarbonato (PC)', 'slug' => 'pc', 'technology' => 'fdm', 'color' => '#0ea5e9'],
            ['name' => 'HIPS', 'slug' => 'hips', 'technology' => 'fdm', 'color' => '#eab308'],
            ['name' => 'PVA (suporte solúvel)', 'slug' => 'pva', 'technology' => 'fdm', 'color' => '#84cc16'],
            ['name' => 'Wood Fill', 'slug' => 'wood-fill', 'technology' => 'fdm', 'color' => '#92400e'],
            ['name' => 'Fibra de Carbono', 'slug' => 'carbon-fiber', 'technology' => 'fdm', 'color' => '#1e293b'],

            // Resinas (SLA/DLP/LCD)
            ['name' => 'Resina Standard', 'slug' => 'resin-standard', 'technology' => 'resin', 'color' => '#ec4899'],
            ['name' => 'Resina Tough (ABS-like)', 'slug' => 'resin-tough', 'technology' => 'resin', 'color' => '#f43f5e'],
            ['name' => 'Resina Flexível', 'slug' => 'resin-flexible', 'technology' => 'resin', 'color' => '#8b5cf6'],
            ['name' => 'Resina Water-Washable', 'slug' => 'resin-water-washable', 'technology' => 'resin', 'color' => '#0891b2'],
            ['name' => 'Resina Castable (joalheria)', 'slug' => 'resin-castable', 'technology' => 'resin', 'color' => '#ca8a04'],
        ];

        foreach ($types as $type) {
            FilamentType::updateOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
