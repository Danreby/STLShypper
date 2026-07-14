<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\UserSettingsResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $this->settingsResolver->forUser($user);
        $filters = $request->only(['search', 'printer_id', 'material_id']);

        $products = $user->products()
            ->with(['printer', 'material'])
            ->filter($filters)
            ->orderBy('name')
            ->get();

        $rows = $products->map(fn ($product) => (new ProductResource($product, $settings))->resolve());

        return Inertia::render('Products', [
            'products' => $rows,
            'printers' => $user->printers()->orderBy('name')->get(['id', 'name']),
            'materials' => $user->materials()->orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
            'totals' => [
                'total_revenue' => round($rows->sum(fn ($r) => $r['pricing']['total_price']), 2),
                'total_profit' => round($rows->sum(fn ($r) => $r['pricing']['total_profit']), 2),
            ],
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $request->user()->products()->create($request->validated());

        return back()->with('success', 'Produto cadastrado com sucesso.');
    }

    public function update(UpdateProductRequest $request, int $product): RedirectResponse
    {
        $model = $request->user()->products()->findOrFail($product);
        $this->authorize('update', $model);

        $model->update($request->validated());

        return back()->with('success', 'Produto atualizado com sucesso.');
    }

    public function destroy(Request $request, int $product): RedirectResponse
    {
        $model = $request->user()->products()->findOrFail($product);
        $this->authorize('delete', $model);

        $model->delete();

        return back()->with('success', 'Produto removido.');
    }
}
