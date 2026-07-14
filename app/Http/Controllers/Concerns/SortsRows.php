<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Support\Collection;

/**
 * Ordena uma coleção já resolvida (arrays de resources) por uma chave
 * pública permitida, com suporte a campos aninhados (dot notation, ex.:
 * "pricing.total_profit") e a campos calculados que não existem como
 * coluna no banco — por isso a ordenação acontece em memória, sobre os
 * dados já carregados, e não via `orderBy` na query.
 */
trait SortsRows
{
    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     * @param  array<string, string>  $allowedSorts  chave pública (?sort=) => caminho dentro de cada linha
     */
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
