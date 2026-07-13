<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\PricingCalculator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $user->setting ?? Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        $products = $user->products()->with(['printer', 'material'])->get();

        $priced = $products->map(fn ($product) => [
            'name' => $product->name,
            'pricing' => PricingCalculator::calculateForProduct($product, $settings),
        ]);

        $totalRevenue = round($priced->sum(fn ($p) => $p['pricing']['total_price']), 2);
        $totalCost = round($priced->sum(fn ($p) => $p['pricing']['cost_with_losses'] * $p['pricing']['quantity']), 2);
        $totalProfit = round($priced->sum(fn ($p) => $p['pricing']['total_profit']), 2);

        return Inertia::render('Dashboard', [
            'stats' => [
                'printers_count' => $user->printers()->count(),
                'materials_count' => $user->materials()->count(),
                'products_count' => $products->count(),
                'total_revenue' => $totalRevenue,
                'total_cost' => $totalCost,
                'total_profit' => $totalProfit,
                'margin_pct' => $totalRevenue > 0 ? round($totalProfit / $totalRevenue, 4) : 0,
            ],
            'topProducts' => $priced
                ->sortByDesc(fn ($p) => $p['pricing']['total_profit'])
                ->take(5)
                ->values(),
            'settings' => $settings,
        ]);
    }
}
