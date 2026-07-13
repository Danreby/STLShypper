<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrinterController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Printers', [
            'printers' => $request->user()->printers()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $request->user()->printers()->create($data);

        return back()->with('success', 'Impressora cadastrada com sucesso.');
    }

    public function update(Request $request, int $printer): RedirectResponse
    {
        $data = $this->validated($request);

        $model = $request->user()->printers()->findOrFail($printer);
        $model->update($data);

        return back()->with('success', 'Impressora atualizada com sucesso.');
    }

    public function destroy(Request $request, int $printer): RedirectResponse
    {
        $request->user()->printers()->findOrFail($printer)->delete();

        return back()->with('success', 'Impressora removida.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'useful_life_hours' => ['required', 'integer', 'min:1'],
            'power_w' => ['required', 'integer', 'min:1'],
            'annual_maintenance' => ['required', 'numeric', 'min:0'],
        ]);
    }
}
