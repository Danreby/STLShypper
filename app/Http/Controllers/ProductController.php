<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PaginatesRows;
use App\Http\Controllers\Concerns\SortsRows;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Services\PricingCalculator;
use App\Services\UserSettingsResolver;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
        $data = $request->validated();
        $settings = $this->settingsResolver->forUser($request->user());

        $request->user()->products()->create($data);

        $warning = $this->consumeMaterialStock($request->user(), $data['material_id'] ?? null, $data, $settings);

        return $this->redirectWithFlash('Produto cadastrado com sucesso.', $warning);
    }

    public function update(UpdateProductRequest $request, int $product): RedirectResponse
    {
        $model = $request->user()->products()->findOrFail($product);
        $this->authorize('update', $model);

        $settings = $this->settingsResolver->forUser($request->user());
        $data = $request->validated();

        $this->restoreMaterialStock($request->user(), $model->material_id, $model->only(['piece_weight_g', 'quantity', 'extra_material_pct']), $settings);

        $model->update($data);

        $warning = $this->consumeMaterialStock($request->user(), $data['material_id'] ?? null, $data, $settings);

        return $this->redirectWithFlash('Produto atualizado com sucesso.', $warning);
    }

    public function pdf(Request $request, int $product)
    {
        $settings = $this->settingsResolver->forUser($request->user());
        $model = $request->user()->products()->with(['printer', 'material'])->findOrFail($product);

        $pdf = Pdf::loadView('pdf.product-quote', [
            'product' => $model,
            'pricing' => PricingCalculator::calculateForProduct($model, $settings),
            'user' => $request->user(),
            'logo' => base64_encode(file_get_contents(public_path('images/logo.png'))),
        ]);

        return $pdf->download('orcamento-'.Str::slug($model->name).'.pdf');
    }

    public function destroy(Request $request, int $product): RedirectResponse
    {
        $model = $request->user()->products()->findOrFail($product);
        $this->authorize('delete', $model);

        $settings = $this->settingsResolver->forUser($request->user());
        $this->restoreMaterialStock($request->user(), $model->material_id, $model->only(['piece_weight_g', 'quantity', 'extra_material_pct']), $settings);

        $model->delete();

        return back()->with('success', 'Produto removido.');
    }

    private function redirectWithFlash(string $success, ?string $warning): RedirectResponse
    {
        $response = back()->with('success', $success);

        return $warning ? $response->with('warning', $warning) : $response;
    }

    /**
     * Desconta do estoque do material o peso consumido pelo pedido. Retorna uma mensagem de
     * aviso quando o estoque restante fica zerado ou negativo, ou null quando está tudo certo.
     */
    private function consumeMaterialStock(User $user, ?int $materialId, array $data, Setting $settings): ?string
    {
        if (! $materialId) {
            return null;
        }

        $material = $user->materials()->find($materialId);
        if (! $material) {
            return null;
        }

        $consumedKg = round(PricingCalculator::materialConsumptionKg($data, $settings), 2);
        $material->decrement('qtd', $consumedKg);

        if ((float) $material->qtd <= 0) {
            return "Estoque de \"{$material->name}\" ficou zerado ou negativo. Considere repor.";
        }

        return null;
    }

    /**
     * Devolve ao estoque do material o peso que havia sido consumido por um pedido (usado antes
     * de atualizar ou remover o pedido, para não perder rastreio do estoque real).
     */
    private function restoreMaterialStock(User $user, ?int $materialId, array $data, Setting $settings): void
    {
        if (! $materialId) {
            return;
        }

        $material = $user->materials()->find($materialId);
        if (! $material) {
            return;
        }

        $consumedKg = round(PricingCalculator::materialConsumptionKg($data, $settings), 2);
        $material->increment('qtd', $consumedKg);
    }
}
