<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Support\Collection;

trait SortsRows
{
    protected function sortRows(Collection $rows, ?string $sort, ?string $direction, array $allowedSorts, string $defaultSort): Collection
    {
        $path = $allowedSorts[$sort] ?? $allowedSorts[$defaultSort];
        $descending = $direction === 'desc';

        return $rows
            ->sortBy(function (array $row) use ($path) {
                $value = data_get($row, $path);

                return is_string($value) ? mb_strtolower($value) : $value;
            }, SORT_REGULAR, $descending)
            ->values();
    }
}
