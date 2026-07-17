<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductPartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'printer_id' => $this->printer_id,
            'material_id' => $this->material_id,
            'printer_name' => $this->printer?->name,
            'material_name' => $this->material?->name,
            'piece_weight_g' => $this->piece_weight_g,
            'print_time_h' => $this->print_time_h,
            'quantity_per_unit' => $this->quantity_per_unit,
        ];
    }
}
