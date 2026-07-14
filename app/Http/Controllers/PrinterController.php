<?php

namespace App\Http\Controllers;

use App\Http\Requests\Printer\StorePrinterRequest;
use App\Http\Requests\Printer\UpdatePrinterRequest;
use App\Http\Resources\PrinterResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrinterController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Printers', [
            'printers' => PrinterResource::collection(
                $request->user()->printers()->orderBy('name')->get()
            ),
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
