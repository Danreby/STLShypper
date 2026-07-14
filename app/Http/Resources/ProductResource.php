<?php

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\Setting;
use App\Services\PricingCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Product $resource
 */
class ProductResource extends JsonResource
{
    public function __construct(Product $resource, private readonly Setting $settings)
    {
        parent::__construct($resource);
    }

    /**
     * @return array<string, mixed>
     */
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
            'labor_cost' => $this->labor_cost,
            'extra_fixed_costs' => $this->extra_fixed_costs,
            'quantity' => $this->quantity,
            'extra_material_pct' => $this->extra_material_pct,
            'failure_pct' => $this->failure_pct,
            'tax_pct' => $this->tax_pct,
            'fee_pct' => $this->fee_pct,
            'margin_pct' => $this->margin_pct,
            'pricing' => PricingCalculator::calculateForProduct($this->resource, $this->settings),
        ];
    }
}
