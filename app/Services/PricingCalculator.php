<?php

namespace App\Services;

use App\Models\Setting;

class PricingCalculator
{

    public static function calculate(array $input, Setting $settings): array
    {
        $pieceWeight = (float) ($input['piece_weight_g'] ?? 0);
        $printTimeTotal = (float) ($input['print_time_h'] ?? 0);
        $laborCost = (float) ($input['labor_cost'] ?? 0);
        $extraFixedCosts = (float) ($input['extra_fixed_costs'] ?? 0);
        $quantity = max(1, (int) ($input['quantity'] ?? 1));
        $printTimePerUnit = $printTimeTotal / $quantity;
        $materialPricePerKg = (float) ($input['material_price_per_kg'] ?? 0);
        $printerPowerW = (float) ($input['printer_power_w'] ?? 0);
        $printerCostPerHour = (float) ($input['printer_cost_per_hour'] ?? 0);

        $extraMaterialPct = self::resolve($input['extra_material_pct'] ?? null, $settings->extra_material_pct);
        $failurePct = self::resolve($input['failure_pct'] ?? null, $settings->failure_pct);
        $taxPct = self::resolve($input['tax_pct'] ?? null, $settings->tax_pct);
        $feePct = self::resolve($input['fee_pct'] ?? null, $settings->fee_pct);
        $marginPct = self::resolve($input['margin_pct'] ?? null, $settings->margin_pct);

        $totalWeight = $pieceWeight * (1 + $extraMaterialPct);
        $materialCost = $totalWeight * $materialPricePerKg / 1000;

        $energyCost = $printerPowerW * $printTimePerUnit * (float) $settings->kwh_price / 1000;

        $machineCost = $printerCostPerHour * $printTimePerUnit;

        $subtotal = $materialCost + $energyCost + $machineCost + $laborCost + $extraFixedCosts;

        $costWithLosses = $failurePct < 1
            ? $subtotal / (1 - $failurePct)
            : $subtotal;

        $minPriceSimpleMarkup = $costWithLosses * (1 + $marginPct);

        $denominator = 1 - $taxPct - $feePct - $marginPct;
        $suggestedPrice = $denominator > 0 ? $costWithLosses / $denominator : 0.0;

        $taxAmount = $suggestedPrice * $taxPct;
        $feeAmount = $suggestedPrice * $feePct;
        $profitPerUnit = $suggestedPrice * $marginPct;

        return [
            'extra_material_pct' => round($extraMaterialPct, 4),
            'total_weight_g' => round($totalWeight, 2),
            'print_time_total_h' => round($printTimeTotal, 2),
            'print_time_per_unit_h' => round($printTimePerUnit, 4),
            'material_cost' => round($materialCost, 2),
            'energy_cost' => round($energyCost, 2),
            'machine_cost' => round($machineCost, 2),
            'labor_cost' => round($laborCost, 2),
            'extra_fixed_costs' => round($extraFixedCosts, 2),
            'subtotal_cost' => round($subtotal, 2),
            'failure_pct' => round($failurePct, 4),
            'cost_with_losses' => round($costWithLosses, 2),
            'tax_pct' => round($taxPct, 4),
            'fee_pct' => round($feePct, 4),
            'margin_pct' => round($marginPct, 4),
            'min_price_simple_markup' => round($minPriceSimpleMarkup, 2),
            'suggested_price_per_unit' => round($suggestedPrice, 2),
            'tax_amount' => round($taxAmount, 2),
            'fee_amount' => round($feeAmount, 2),
            'profit_per_unit' => round($profitPerUnit, 2),
            'quantity' => $quantity,
            'total_price' => round($suggestedPrice * $quantity, 2),
            'total_profit' => round($profitPerUnit * $quantity, 2),
            'denominator_warning' => $denominator <= 0,
        ];
    }

    public static function calculateForProduct(\App\Models\Product $product, Setting $settings): array
    {
        $printer = $product->printer;
        $material = $product->material;

        $printerCostPerHour = $printer ? $printer->totalCostPerHour((int) $settings->hours_per_year) : 0.0;
        $materialPricePerKg = $material ? (float) $material->price_per_kg : 0.0;

        return self::calculate([
            'piece_weight_g' => (float) $product->piece_weight_g,
            'print_time_h' => (float) $product->print_time_h,
            'labor_cost' => (float) $product->labor_cost,
            'extra_fixed_costs' => (float) $product->extra_fixed_costs,
            'quantity' => (int) $product->quantity,
            'material_price_per_kg' => $materialPricePerKg,
            'printer_power_w' => $printer ? (float) $printer->power_w : 0.0,
            'printer_cost_per_hour' => $printerCostPerHour,
            'extra_material_pct' => $product->extra_material_pct,
            'failure_pct' => $product->failure_pct,
            'tax_pct' => $product->tax_pct,
            'fee_pct' => $product->fee_pct,
            'margin_pct' => $product->margin_pct,
        ], $settings);
    }

    private static function resolve(mixed $override, mixed $default): float
    {
        return $override !== null && $override !== '' ? (float) $override : (float) $default;
    }
}
