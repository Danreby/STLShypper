<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductPart extends Model
{
    protected $fillable = [
        'product_id', 'printer_id', 'material_id', 'name', 'piece_weight_g', 'print_time_h', 'quantity_per_unit',
    ];

    protected function casts(): array
    {
        return [
            'piece_weight_g' => 'decimal:2',
            'print_time_h' => 'decimal:2',
            'quantity_per_unit' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
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
