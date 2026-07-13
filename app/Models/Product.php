<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name', 'printer_id', 'material_id', 'piece_weight_g', 'print_time_h',
    'labor_cost', 'extra_fixed_costs', 'quantity',
    'extra_material_pct', 'failure_pct', 'tax_pct', 'fee_pct', 'margin_pct',
])]
class Product extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'piece_weight_g' => 'decimal:2',
            'print_time_h' => 'decimal:2',
            'labor_cost' => 'decimal:2',
            'extra_fixed_costs' => 'decimal:2',
            'quantity' => 'integer',
            'extra_material_pct' => 'decimal:4',
            'failure_pct' => 'decimal:4',
            'tax_pct' => 'decimal:4',
            'fee_pct' => 'decimal:4',
            'margin_pct' => 'decimal:4',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function printer(): BelongsTo
    {
        return $this->belongsTo(Printer::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
