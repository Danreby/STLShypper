<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kwh_price' => (float) $this->kwh_price,
            'labor_rate' => (float) $this->labor_rate,
            'failure_pct' => (float) $this->failure_pct,
            'extra_material_pct' => (float) $this->extra_material_pct,
            'tax_pct' => (float) $this->tax_pct,
            'fee_pct' => (float) $this->fee_pct,
            'margin_pct' => (float) $this->margin_pct,
            'hours_per_year' => $this->hours_per_year,
        ];
    }
}
