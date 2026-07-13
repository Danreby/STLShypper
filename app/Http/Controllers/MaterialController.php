<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Materials', [
            'materials' => $request->user()->materials()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $request->user()->materials()->create($data);

        return back()->with('success', 'Material cadastrado com sucesso.');
    }

    public function update(Request $request, int $material): RedirectResponse
    {
        $data = $this->validated($request);

        $model = $request->user()->materials()->findOrFail($material);
        $model->update($data);

        return back()->with('success', 'Material atualizado com sucesso.');
    }

    public function destroy(Request $request, int $material): RedirectResponse
    {
        $request->user()->materials()->findOrFail($material)->delete();

        return back()->with('success', 'Material removido.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:100'],
            'price_per_kg' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
