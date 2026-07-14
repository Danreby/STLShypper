<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SortsRows;
use App\Http\Requests\Printer\StorePrinterRequest;
use App\Http\Requests\Printer\UpdatePrinterRequest;
use App\Http\Resources\PrinterResource;
use App\Models\Printer;
use App\Services\UserSettingsResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrinterController extends Controller
{
    use SortsRows;

    /** Chave pública de ordenação (?sort=) => caminho dentro do PrinterResource. */
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

        $printers = $request->user()->printers()->filter($filters)->get();

        $rows = $this->sortRows(
            $printers->map(fn (Printer $printer) => (new PrinterResource($printer, $hoursPerYear))->resolve()),
            $sort,
            $direction,
            self::SORTABLE,
            'name'
        );

        return Inertia::render('Printers', [
            'printers' => $rows,
            'filters' => [...$filters, 'sort' => $sort, 'direction' => $direction],
        ]);
    }

    public function store(StorePrinterRequest $request): RedirectResponse
    {
        $request->user()->printers()->create($request->validated());

        return back()->with('success', 'Impressora cadastrada com sucesso.');
    }

    public function update(UpdatePrinterRequest $request, int $printer): RedirectResponse
    {
        $model = $request->user()->printers()->findOrFail($printer);
        $this->authorize('update', $model);

        $model->update($request->validated());

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
