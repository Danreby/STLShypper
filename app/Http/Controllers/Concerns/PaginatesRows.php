<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

trait PaginatesRows
{
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
