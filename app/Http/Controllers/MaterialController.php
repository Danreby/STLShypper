<?php

namespace App\Http\Controllers;

use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type']);

        $materials = $request->user()->materials()
            ->filter($filters)
            ->orderBy('name')
            ->get();

        $types = $request->user()->materials()->distinct()->orderBy('type')->pluck('type');

        return Inertia::render('Materials', [
            'materials' => MaterialResource::collection($materials),
            'types' => $types,
            'filters' => $filters,
        ]);
    }

    public function store(StoreMaterialRequest $request): RedirectResponse
    {
        $request->user()->materials()->create($request->validated());

        return back()->with('success', 'Material cadastrado com sucesso.');
    }

    public function update(UpdateMaterialRequest $request, int $material): RedirectResponse
    {
        $model = $request->user()->materials()->findOrFail($material);
        $this->authorize('update', $model);

        $model->update($request->validated());

        return back()->with('success', 'Material atualizado com sucesso.');
    }

    public function destroy(Request $request, int $material): RedirectResponse
    {
        $model = $request->user()->materials()->findOrFail($material);
        $this->authorize('delete', $model);

        $model->delete();

        return back()->with('success', 'Material removido.');
    }
}
