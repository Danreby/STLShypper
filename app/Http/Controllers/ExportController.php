<?php

namespace App\Http\Controllers;

use App\Http\Resources\MaterialResource;
use App\Http\Resources\PrinterResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SettingResource;
use App\Services\UserSettingsResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Fornece, em um único payload JSON, todos os dados necessários para o
 * frontend gerar a planilha de exportação (Parâmetros, Impressoras,
 * Materiais, Tabela de Produtos e Resumo), espelhando as abas da
 * planilha original "Precificação de Impressão 3D".
 */
class ExportController extends Controller
{
    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $settings = $this->settingsResolver->forUser($user);
        $hoursPerYear = (int) $settings->hours_per_year;

        $printers = $user->printers()->orderBy('name')->get();
        $materials = $user->materials()->orderBy('name')->get();
        $products = $user->products()->with(['printer', 'material'])->orderBy('name')->get();

        $productRows = $products->map(fn ($product) => (new ProductResource($product, $settings))->resolve())->values();

        $totalRevenue = round($productRows->sum(fn ($p) => $p['pricing']['total_price']), 2);
        $totalCost = round($productRows->sum(fn ($p) => $p['pricing']['cost_with_losses'] * $p['pricing']['quantity']), 2);
        $totalProfit = round($productRows->sum(fn ($p) => $p['pricing']['total_profit']), 2);
        $totalQuantity = (int) $productRows->sum(fn ($p) => $p['pricing']['quantity']);

        return response()->json([
            'settings' => (new SettingResource($settings))->resolve(),
            'printers' => $printers->map(fn ($printer) => (new PrinterResource($printer, $hoursPerYear))->resolve())->values(),
            'materials' => $materials->map(fn ($material) => (new MaterialResource($material))->resolve())->values(),
            'products' => $productRows,
            'summary' => [
                'products_count' => $products->count(),
                'total_quantity' => $totalQuantity,
                'total_cost' => $totalCost,
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'margin_pct' => $totalRevenue > 0 ? round($totalProfit / $totalRevenue, 4) : 0,
            ],
        ]);
    }
}
