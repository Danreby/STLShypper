<?php

namespace App\Http\Controllers;

use App\Http\Resources\SettingResource;
use App\Services\PricingCalculator;
use App\Services\UserSettingsResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $this->settingsResolver->forUser($user);

        $products = $user->products()->with(['printer', 'material', 'parts.printer', 'parts.material'])->get();

        $priced = $products->map(fn ($product) => [
            'name' => $product->name,
            'printer_name' => $product->printer?->name,
            'material_name' => $product->material?->name,
            'pricing' => PricingCalculator::calculateForProduct($product, $settings),
        ]);

        $totalRevenue = round($priced->sum(fn ($p) => $p['pricing']['total_price']), 2);
        $totalCost = round($priced->sum(fn ($p) => $p['pricing']['cost_with_losses'] * $p['pricing']['quantity']), 2);
        $totalProfit = round($priced->sum(fn ($p) => $p['pricing']['total_profit']), 2);
        $totalQuantity = (int) $priced->sum(fn ($p) => $p['pricing']['quantity']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'printers_count' => $user->printers()->count(),
                'materials_count' => $user->materials()->count(),
                'products_count' => $products->count(),
                'total_quantity' => $totalQuantity,
                'total_revenue' => $totalRevenue,
                'total_cost' => $totalCost,
                'total_profit' => $totalProfit,
                'margin_pct' => $totalRevenue > 0 ? round($totalProfit / $totalRevenue, 4) : 0,
            ],
            'topProducts' => $priced
                ->sortByDesc(fn ($p) => $p['pricing']['total_profit'])
                ->take(5)
                ->values(),
            'profitByMaterial' => $this->groupProfit($priced, 'material_name'),
            'profitByPrinter' => $this->groupProfit($priced, 'printer_name'),
            'settings' => new SettingResource($settings),
        ]);
    }

    /**
     * Agrupa o lucro total por material/impressora, ordenado do maior para o menor.
     * Além de um certo número de grupos, o restante é somado em "Outros" para manter o gráfico legível.
     */
    private function groupProfit($priced, string $groupKey, int $limit = 7): array
    {
        $grouped = $priced
            ->filter(fn ($p) => $p[$groupKey])
            ->groupBy($groupKey)
            ->map(fn ($group, $label) => [
                'label' => $label,
                'profit' => round($group->sum(fn ($p) => $p['pricing']['total_profit']), 2),
            ])
            ->sortByDesc('profit')
            ->values();

        if ($grouped->count() <= $limit) {
            return $grouped->all();
        }

        $top = $grouped->take($limit);
        $otherProfit = round($grouped->slice($limit)->sum('profit'), 2);

        return $top->push(['label' => 'Outros', 'profit' => $otherProfit])->all();
    }
}
