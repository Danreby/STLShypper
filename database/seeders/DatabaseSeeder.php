<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Cria um usuário de demonstração com os mesmos dados de exemplo da
     * planilha original (Parâmetros Gerais, Impressoras e Materiais),
     * para que o sistema já nasça pronto para uso.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@stlshypper.test'],
            [
                'name' => 'Usuário Demo',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $setting = Setting::firstOrCreate(
            ['user_id' => $user->id],
            Setting::defaults()
        );

        $printers = [
            ['name' => 'Ender 3 (aprox. 120W)', 'purchase_price' => 1200, 'useful_life_hours' => 8000, 'power_w' => 120, 'annual_maintenance' => 250],
            ['name' => 'Elegoo Neptune 4 (aprox. 150W)', 'purchase_price' => 1800, 'useful_life_hours' => 8000, 'power_w' => 150, 'annual_maintenance' => 250],
            ['name' => 'Bambu A1 Mini (aprox. 150W)', 'purchase_price' => 2300, 'useful_life_hours' => 12000, 'power_w' => 150, 'annual_maintenance' => 200],
            ['name' => 'Bambu A1 (aprox. 200W)', 'purchase_price' => 3200, 'useful_life_hours' => 12000, 'power_w' => 200, 'annual_maintenance' => 250],
            ['name' => 'Bambu X1 Carbon (aprox. 350W)', 'purchase_price' => 8500, 'useful_life_hours' => 15000, 'power_w' => 350, 'annual_maintenance' => 400],
            ['name' => 'Impressora de Resina (aprox. 80W)', 'purchase_price' => 2500, 'useful_life_hours' => 8000, 'power_w' => 80, 'annual_maintenance' => 300],
        ];

        $printerModels = [];
        foreach ($printers as $printer) {
            $printerModels[$printer['name']] = Printer::firstOrCreate(
                ['user_id' => $user->id, 'name' => $printer['name']],
                array_merge(['user_id' => $user->id], $printer)
            );
        }

        $materials = [
            ['name' => 'PLA Basic', 'type' => 'Filamento', 'price_per_kg' => 89.90, 'notes' => 'Uso geral'],
            ['name' => 'PLA Premium HT High Speed', 'type' => 'Filamento', 'price_per_kg' => 119.90, 'notes' => 'Impressão rápida'],
            ['name' => 'PLA Premium HT Impact', 'type' => 'Filamento', 'price_per_kg' => 129.90, 'notes' => 'Maior resistência a impacto'],
            ['name' => 'PLA Silk', 'type' => 'Filamento', 'price_per_kg' => 109.90, 'notes' => 'Acabamento acetinado'],
            ['name' => 'PLA Wood', 'type' => 'Filamento', 'price_per_kg' => 109.90, 'notes' => 'Acabamento amadeirado'],
            ['name' => 'ABS Premium', 'type' => 'Filamento', 'price_per_kg' => 109.90, 'notes' => 'Peças funcionais'],
            ['name' => 'PETG', 'type' => 'Filamento', 'price_per_kg' => 109.90, 'notes' => 'Boa resistência química/mecânica'],
            ['name' => 'ASA', 'type' => 'Filamento', 'price_per_kg' => 139.90, 'notes' => 'Resistente a UV / uso externo'],
            ['name' => 'Nylon', 'type' => 'Filamento', 'price_per_kg' => 199.90, 'notes' => 'Alta resistência mecânica'],
            ['name' => 'TPU Flexível', 'type' => 'Filamento', 'price_per_kg' => 149.90, 'notes' => 'Peças flexíveis'],
            ['name' => 'Resina Premium Standard', 'type' => 'Resina', 'price_per_kg' => 199.90, 'notes' => 'Uso geral em SLA/DLP'],
            ['name' => 'Resina Alta Resolução', 'type' => 'Resina', 'price_per_kg' => 249.90, 'notes' => 'Detalhamento fino'],
        ];

        $materialModels = [];
        foreach ($materials as $material) {
            $materialModels[$material['name']] = Material::firstOrCreate(
                ['user_id' => $user->id, 'name' => $material['name']],
                array_merge(['user_id' => $user->id], $material)
            );
        }

        $products = [
            [
                'name' => 'Chaveiro Personalizado',
                'printer' => 'Ender 3 (aprox. 120W)',
                'material' => 'PLA Basic',
                'piece_weight_g' => 12,
                'print_time_h' => 0.5,
                'labor_cost' => 5,
                'extra_fixed_costs' => 1,
                'quantity' => 20,
            ],
            [
                'name' => 'Suporte de Celular',
                'printer' => 'Elegoo Neptune 4 (aprox. 150W)',
                'material' => 'PETG',
                'piece_weight_g' => 60,
                'print_time_h' => 1.5,
                'labor_cost' => 8,
                'extra_fixed_costs' => 1.5,
                'quantity' => 10,
            ],
            [
                'name' => 'Vaso Decorativo Médio',
                'printer' => 'Bambu X1 Carbon (aprox. 350W)',
                'material' => 'PLA Silk',
                'piece_weight_g' => 180,
                'print_time_h' => 4.0,
                'labor_cost' => 15,
                'extra_fixed_costs' => 3,
                'quantity' => 5,
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['user_id' => $user->id, 'name' => $product['name']],
                [
                    'user_id' => $user->id,
                    'printer_id' => $printerModels[$product['printer']]->id,
                    'material_id' => $materialModels[$product['material']]->id,
                    'name' => $product['name'],
                    'piece_weight_g' => $product['piece_weight_g'],
                    'print_time_h' => $product['print_time_h'],
                    'labor_cost' => $product['labor_cost'],
                    'extra_fixed_costs' => $product['extra_fixed_costs'],
                    'quantity' => $product['quantity'],
                ]
            );
        }
    }
}
