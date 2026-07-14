<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Pagina uma coleção já filtrada e ordenada em memória (arrays de resources).
 * Não usamos `Builder::paginate()` porque a ordenação, feita por `SortsRows`,
 * pode depender de campos calculados que não existem como coluna no banco —
 * então o recorte da página também precisa acontecer depois de resolver os
 * dados, sobre a mesma coleção já ordenada.
 */
trait PaginatesRows
{
    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     */
    protected function paginateRows(Collection $rows, Request $request, int $perPage = 10): LengthAwarePaginator
    {
        $page = LengthAwarePaginator::resolveCurrentPage();
        $items = $rows->slice(($page - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator($items, $rows->count(), $perPage, $page, [
            'path' => $request->url(),
            'query' => $request->query(),
        ]);
    }
}
