<?php

namespace App\Http\Controllers;

use App\Actions\Printer\SyncPrinterFilamentTypes;
use App\Http\Controllers\Concerns\PaginatesRows;
use App\Http\Controllers\Concerns\SortsRows;
use App\Http\Requests\Printer\StorePrinterRequest;
use App\Http\Requests\Printer\UpdatePrinterRequest;
use App\Http\Resources\FilamentTypeResource;
use App\Http\Resources\PrinterResource;
use App\Models\FilamentType;
use App\Models\Printer;
use App\Services\UserSettingsResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrinterController extends Controller
{
    use PaginatesRows;
    use SortsRows;

    private const SORTABLE = [
        'name' => 'name',
        'purchase_price' => 'purchase_price',
        'useful_life_hours' => 'useful_life_hours',
        'power_w' => 'power_w',
        'annual_maintenance' => 'annual_maintenance',
        'depreciation_per_hour' => 'depreciation_per_hour',
        'maintenance_per_hour' => 'maintenance_per_hour',
        'total_cost_per_hour' => 'total_cost_per_hour',
    ];

    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): Response
    {
        $hoursPerYear = (int) $this->settingsResolver->forUser($request->user())->hours_per_year;
        $filters = $request->only(['search']);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'desc' ? 'desc' : 'asc';

        $printers = $request->user()->printers()->with('filamentTypes')->filter($filters)->get();

        $rows = $this->sortRows(
            $printers->map(fn (Printer $printer) => (new PrinterResource($printer, $hoursPerYear))->resolve()),
            $sort,
            $direction,
            self::SORTABLE,
            'name'
        );

        $paginator = $this->paginateRows($rows, $request);

        return Inertia::render('Printers', [
            'printers' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'filters' => [...$filters, 'sort' => $sort, 'direction' => $direction],
            'filamentTypes' => FilamentTypeResource::collection(
                FilamentType::orderBy('technology')->orderBy('name')->get()
            ),
        ]);
    }

    public function store(StorePrinterRequest $request, SyncPrinterFilamentTypes $syncFilamentTypes): RedirectResponse
    {
        $data = $request->validated();
        $filamentTypeIds = $data['filament_type_ids'] ?? [];
        unset($data['filament_type_ids']);

        $printer = $request->user()->printers()->create($data);
        $syncFilamentTypes->handle($printer, $filamentTypeIds);

        return back()->with('success', 'Impressora cadastrada com sucesso.');
    }

    public function update(UpdatePrinterRequest $request, int $printer, SyncPrinterFilamentTypes $syncFilamentTypes): RedirectResponse
    {
        $model = $request->user()->printers()->findOrFail($printer);
        $this->authorize('update', $model);

        $data = $request->validated();
        $filamentTypeIds = $data['filament_type_ids'] ?? [];
        unset($data['filament_type_ids']);

        $model->update($data);
        $syncFilamentTypes->handle($model, $filamentTypeIds);

        return back()->with('success', 'Impressora atualizada com sucesso.');
    }

    public function destroy(Request $request, int $printer): RedirectResponse
    {
        $model = $request->user()->printers()->findOrFail($printer);
        $this->authorize('delete', $model);

        $model->delete();

        return back()->with('success', 'Impressora removida.');
    }
}
