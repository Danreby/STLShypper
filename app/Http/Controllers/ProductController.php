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

        $products = $user->products()->with(['printer', 'material', 'parts.printer', 'parts.material'])->filter($filters)->get();

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
        $data = $this->withCompositeDefaults($request->validated());
        $settings = $this->settingsResolver->forUser($request->user());
        $partsData = $data['parts'] ?? [];
        unset($data['parts']);

        $product = $request->user()->products()->create($data);

        if (! empty($partsData)) {
            $product->parts()->createMany($partsData);
        }

        $entries = $this->materialConsumptionEntries([...$data, 'parts' => $partsData], $settings);
        $warning = $this->consumeMaterialStock($request->user(), $entries);

        return $this->redirectWithFlash('Produto cadastrado com sucesso.', $warning);
    }

    public function update(UpdateProductRequest $request, int $product): RedirectResponse
    {
        $model = $request->user()->products()->with('parts')->findOrFail($product);
        $this->authorize('update', $model);

        $settings = $this->settingsResolver->forUser($request->user());
        $data = $this->withCompositeDefaults($request->validated());
        $partsData = $data['parts'] ?? [];
        unset($data['parts']);

        $oldEntries = $this->materialConsumptionEntries($this->productAsConsumptionInput($model), $settings);
        $this->restoreMaterialStock($request->user(), $oldEntries);

        $model->update($data);
        $model->parts()->delete();
        if (! empty($partsData)) {
            $model->parts()->createMany($partsData);
        }

        $newEntries = $this->materialConsumptionEntries([...$data, 'parts' => $partsData], $settings);
        $warning = $this->consumeMaterialStock($request->user(), $newEntries);

        return $this->redirectWithFlash('Produto atualizado com sucesso.', $warning);
    }

    public function pdf(Request $request, int $product)
    {
        $settings = $this->settingsResolver->forUser($request->user());
        $model = $request->user()->products()->with(['printer', 'material', 'parts.printer', 'parts.material'])->findOrFail($product);

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
        $model = $request->user()->products()->with('parts')->findOrFail($product);
        $this->authorize('delete', $model);

        $settings = $this->settingsResolver->forUser($request->user());
        $entries = $this->materialConsumptionEntries($this->productAsConsumptionInput($model), $settings);
        $this->restoreMaterialStock($request->user(), $entries);

        $model->delete();

        return back()->with('success', 'Produto removido.');
    }

    private function withCompositeDefaults(array $data): array
    {
        $data['piece_weight_g'] ??= 0;
        $data['print_time_h'] ??= 0;

        return $data;
    }

    private function redirectWithFlash(string $success, ?string $warning): RedirectResponse
    {
        $response = back()->with('success', $success);

        return $warning ? $response->with('warning', $warning) : $response;
    }

    private function productAsConsumptionInput(Product $product): array
    {
        return [
            'material_id' => $product->material_id,
            'piece_weight_g' => $product->piece_weight_g,
            'quantity' => $product->quantity,
            'extra_material_pct' => $product->extra_material_pct,
            'parts' => $product->parts->map(fn ($part) => [
                'material_id' => $part->material_id,
                'piece_weight_g' => (float) $part->piece_weight_g,
                'quantity_per_unit' => $part->quantity_per_unit,
            ])->all(),
        ];
    }

    /**
     * Calcula quanto (kg) cada material é consumido por um produto — somando as partes quando o
     * produto é composto, ou usando o material único quando é uma peça simples. Retorna um mapa
     * [material_id => kg].
     *
     * @return array<int, float>
     */
    private function materialConsumptionEntries(array $data, Setting $settings): array
    {
        $quantity = (int) ($data['quantity'] ?? 1);
        $parts = $data['parts'] ?? [];

        if (! empty($parts)) {
            $totals = [];
            foreach ($parts as $part) {
                if (empty($part['material_id'])) {
                    continue;
                }

                $kg = PricingCalculator::materialConsumptionKg([
                    'piece_weight_g' => (float) ($part['piece_weight_g'] ?? 0) * max(1, (int) ($part['quantity_per_unit'] ?? 1)),
                    'quantity' => $quantity,
                    'extra_material_pct' => $data['extra_material_pct'] ?? null,
                ], $settings);

                $totals[$part['material_id']] = ($totals[$part['material_id']] ?? 0) + $kg;
            }

            return $totals;
        }

        if (empty($data['material_id'])) {
            return [];
        }

        return [$data['material_id'] => PricingCalculator::materialConsumptionKg($data, $settings)];
    }

    /**
     * Desconta do estoque de cada material o peso consumido pelo pedido. Retorna uma mensagem de
     * aviso quando algum estoque restante fica zerado ou negativo, ou null quando está tudo certo.
     */
    private function consumeMaterialStock(User $user, array $entries): ?string
    {
        $warning = null;

        foreach ($entries as $materialId => $kg) {
            $material = $user->materials()->find($materialId);
            if (! $material) {
                continue;
            }

            $material->decrement('qtd', round($kg, 2));

            if ((float) $material->qtd <= 0) {
                $warning = "Estoque de \"{$material->name}\" ficou zerado ou negativo. Considere repor.";
            }
        }

        return $warning;
    }

    /**
     * Devolve ao estoque de cada material o peso que havia sido consumido por um pedido (usado
     * antes de atualizar ou remover o pedido, para não perder rastreio do estoque real).
     */
    private function restoreMaterialStock(User $user, array $entries): void
    {
        foreach ($entries as $materialId => $kg) {
            $material = $user->materials()->find($materialId);
            if (! $material) {
                continue;
            }

            $material->increment('qtd', round($kg, 2));
        }
    }
}
