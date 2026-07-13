<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\PricingCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $user->setting ?? Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        $products = $user->products()->with(['printer', 'material'])->orderBy('name')->get();

        $rows = $products->map(function ($product) use ($settings) {
            $result = $this->priceProduct($product, $settings);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'printer_id' => $product->printer_id,
                'material_id' => $product->material_id,
                'printer_name' => $product->printer?->name,
                'material_name' => $product->material?->name,
                'piece_weight_g' => $product->piece_weight_g,
                'print_time_h' => $product->print_time_h,
                'labor_cost' => $product->labor_cost,
                'extra_fixed_costs' => $product->extra_fixed_costs,
                'quantity' => $product->quantity,
                'extra_material_pct' => $product->extra_material_pct,
                'failure_pct' => $product->failure_pct,
                'tax_pct' => $product->tax_pct,
                'fee_pct' => $product->fee_pct,
                'margin_pct' => $product->margin_pct,
                'pricing' => $result,
            ];
        });

        return Inertia::render('Products', [
            'products' => $rows,
            'printers' => $user->printers()->orderBy('name')->get(['id', 'name']),
            'materials' => $user->materials()->orderBy('name')->get(['id', 'name']),
            'totals' => [
                'total_revenue' => round($rows->sum(fn ($r) => $r['pricing']['total_price']), 2),
                'total_profit' => round($rows->sum(fn ($r) => $r['pricing']['total_profit']), 2),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $request->user()->products()->create($data);

        return back()->with('success', 'Produto cadastrado com sucesso.');
    }

    public function update(Request $request, int $product): RedirectResponse
    {
        $data = $this->validated($request);

        $model = $request->user()->products()->findOrFail($product);
        $model->update($data);

        return back()->with('success', 'Produto atualizado com sucesso.');
    }

    public function destroy(Request $request, int $product): RedirectResponse
    {
        $request->user()->products()->findOrFail($product)->delete();

        return back()->with('success', 'Produto removido.');
    }

    private function priceProduct($product, Setting $settings): array
    {
        return PricingCalculator::calculateForProduct($product, $settings);
    }

    private function validated(Request $request): array
    {
        $userId = $request->user()->id;

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'printer_id' => [
                'nullable', 'integer',
                Rule::exists('printers', 'id')->where('user_id', $userId),
            ],
            'material_id' => [
                'nullable', 'integer',
                Rule::exists('materials', 'id')->where('user_id', $userId),
            ],
            'piece_weight_g' => ['required', 'numeric', 'min:0'],
            'print_time_h' => ['required', 'numeric', 'min:0'],
            'labor_cost' => ['required', 'numeric', 'min:0'],
            'extra_fixed_costs' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'],
            'extra_material_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'failure_pct' => ['nullable', 'numeric', 'min:0', 'max:0.9999'],
            'tax_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ]);
    }
}
