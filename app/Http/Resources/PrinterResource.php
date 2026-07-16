<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrinterResource extends JsonResource
{
    public function __construct(\App\Models\Printer $resource, private readonly int $hoursPerYear)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'technology' => $this->technology->value,
            'technology_label' => $this->technology->label(),
            'purchase_price' => (float) $this->purchase_price,
            'useful_life_hours' => $this->useful_life_hours,
            'power_w' => $this->power_w,
            'annual_maintenance' => (float) $this->annual_maintenance,
            'purchase_url' => $this->purchase_url,
            'depreciation_per_hour' => round($this->depreciationPerHour(), 4),
            'maintenance_per_hour' => round($this->maintenancePerHour($this->hoursPerYear), 4),
            'total_cost_per_hour' => round($this->totalCostPerHour($this->hoursPerYear), 4),
            'filament_types' => FilamentTypeResource::collection($this->whenLoaded('filamentTypes')),
        ];
    }
}
