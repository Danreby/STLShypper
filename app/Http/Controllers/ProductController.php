<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PaginatesRows;
use App\Http\Controllers\Concerns\SortsRows;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\UserSettingsResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use PaginatesRows;
    use SortsRows;

    private const SORTABLE = [
        'name' => 'name',
        'printer_name' => 'printer_name',
        'material_name' => 'material_name',
        'quantity' => 'quantity',
        'cost' => 'pricing.cost_with_losses',
        'price' => 'pricing.suggested_price_per_unit',
        'profit' => 'pricing.total_profit',
    ];

    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $settings = $this->settingsResolver->forUser($user);
        $filters = $request->only(['search', 'printer_id', 'material_id']);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'desc' ? 'desc' : 'asc';

        $products = $user->products()->with(['printer', 'material'])->filter($filters)->get();

        $rows = $products->map(fn (Product $product) => (new ProductResource($product, $settings))->resolve());

        $sortedRows = $this->sortRows($rows, $sort, $direction, self::SORTABLE, 'name');
        $paginator = $this->paginateRows($sortedRows, $request);

        return Inertia::render('Products', [
            'products' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'printers' => $user->printers()->orderBy('name')->get(['id', 'name']),
            'materials' => $user->materials()->orderBy('name')->get(['id', 'name']),
            'filters' => [...$filters, 'sort' => $sort, 'direction' => $direction],
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
