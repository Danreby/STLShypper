<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\PricingCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Aba "Calculadora (1 Peça)" da planilha: simula custo e preço de uma
 * peça avulsa. A página é renderizada via Inertia, mas o cálculo em si
 * é feito por uma chamada axios (JSON) sem recarregar a página.
 */
class CalculatorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $user->setting ?? Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        return Inertia::render('Calculator', [
            'printers' => $user->printers()->orderBy('name')->get(),
            'materials' => $user->materials()->orderBy('name')->get(),
            'settings' => $settings,
        ]);
    }

    public function compute(Request $request): JsonResponse
    {
        $user = $request->user();
        $settings = $user->setting ?? Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        $data = $request->validate([
            'piece_weight_g' => ['required', 'numeric', 'min:0'],
            'print_time_h' => ['required', 'numeric', 'min:0'],
            'labor_cost' => ['nullable', 'numeric', 'min:0'],
            'extra_fixed_costs' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'printer_id' => ['nullable', 'integer'],
            'material_id' => ['nullable', 'integer'],
            'extra_material_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'failure_pct' => ['nullable', 'numeric', 'min:0', 'max:0.9999'],
            'tax_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ]);

        $printer = $data['printer_id'] ?? null ? $user->printers()->find($data['printer_id']) : null;
        $material = $data['material_id'] ?? null ? $user->materials()->find($data['material_id']) : null;

        $printerCostPerHour = $printer ? $printer->totalCostPerHour((int) $settings->hours_per_year) : 0.0;
        $materialPricePerKg = $material ? (float) $material->price_per_kg : 0.0;

        $result = PricingCalculator::calculate([
            'piece_weight_g' => (float) $data['piece_weight_g'],
            'print_time_h' => (float) $data['print_time_h'],
            'labor_cost' => (float) ($data['labor_cost'] ?? 0),
            'extra_fixed_costs' => (float) ($data['extra_fixed_costs'] ?? 0),
            'quantity' => (int) ($data['quantity'] ?? 1),
            'material_price_per_kg' => $materialPricePerKg,
            'printer_power_w' => $printer ? (float) $printer->power_w : 0.0,
            'printer_cost_per_hour' => $printerCostPerHour,
            'extra_material_pct' => $data['extra_material_pct'] ?? null,
            'failure_pct' => $data['failure_pct'] ?? null,
            'tax_pct' => $data['tax_pct'] ?? null,
            'fee_pct' => $data['fee_pct'] ?? null,
            'margin_pct' => $data['margin_pct'] ?? null,
        ], $settings);

        return response()->json(['result' => $result]);
    }
}
