<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'price_per_kg' => (float) $this->price_per_kg,
            'price_per_gram' => round($this->pricePerGram(), 4),
            'qtd' => (float) $this->qtd,
            'notes' => $this->notes,
            'purchase_url' => $this->purchase_url,
        ];
    }
}
