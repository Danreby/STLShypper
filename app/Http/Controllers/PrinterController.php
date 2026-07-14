<?php

namespace App\Http\Controllers;

use App\Http\Requests\Printer\StorePrinterRequest;
use App\Http\Requests\Printer\UpdatePrinterRequest;
use App\Http\Resources\PrinterResource;
use App\Services\UserSettingsResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrinterController extends Controller
{
    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function index(Request $request): Response
    {
        $hoursPerYear = (int) $this->settingsResolver->forUser($request->user())->hours_per_year;
        $filters = $request->only(['search']);

        $printers = $request->user()->printers()
            ->filter($filters)
            ->orderBy('name')
            ->get();

        return Inertia::render('Printers', [
            'printers' => $printers->map(fn ($printer) => (new PrinterResource($printer, $hoursPerYear))->resolve()),
            'filters' => $filters,
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
