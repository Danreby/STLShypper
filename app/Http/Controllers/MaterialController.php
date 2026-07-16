<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PaginatesRows;
use App\Http\Controllers\Concerns\SortsRows;
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
    use PaginatesRows;
    use SortsRows;

    private const SORTABLE = [
        'name' => 'name',
        'type' => 'type',
        'price_per_kg' => 'price_per_kg',
        'price_per_gram' => 'price_per_gram',
        'qtd' => 'qtd',
    ];

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type']);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'desc' ? 'desc' : 'asc';

        $materials = $request->user()->materials()->filter($filters)->get();

        $rows = $this->sortRows(
            $materials->map(fn (Material $material) => (new MaterialResource($material))->resolve()),
            $sort,
            $direction,
            self::SORTABLE,
            'name'
        );

        $types = $request->user()->materials()->distinct()->orderBy('type')->pluck('type');

        $paginator = $this->paginateRows($rows, $request);

        return Inertia::render('Materials', [
            'materials' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'types' => $types,
            'filters' => [...$filters, 'sort' => $sort, 'direction' => $direction],
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
