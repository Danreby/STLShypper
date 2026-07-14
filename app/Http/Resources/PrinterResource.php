<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrinterResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'purchase_price' => (float) $this->purchase_price,
            'useful_life_hours' => $this->useful_life_hours,
            'power_w' => $this->power_w,
            'annual_maintenance' => (float) $this->annual_maintenance,
            'depreciation_per_hour' => round($this->depreciationPerHour(), 4),
        ];
    }
}
