<?php

namespace App\Actions\Printer;

use App\Models\Printer;

class SyncPrinterFilamentTypes
{
    /**
     * @param  array<int, int>  $filamentTypeIds
     */
    public function handle(Printer $printer, array $filamentTypeIds): void
    {
        $printer->filamentTypes()->sync($filamentTypeIds);
    }
}
