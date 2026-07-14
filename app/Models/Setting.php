<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    protected $fillable = [
        'user_id', 'kwh_price', 'labor_rate', 'failure_pct', 'extra_material_pct',
        'tax_pct', 'fee_pct', 'margin_pct', 'hours_per_year',
    ];

    protected function casts(): array
    {
        return [
            'kwh_price' => 'decimal:4',
            'labor_rate' => 'decimal:2',
            'failure_pct' => 'decimal:4',
            'extra_material_pct' => 'decimal:4',
            'tax_pct' => 'decimal:4',
            'fee_pct' => 'decimal:4',
            'margin_pct' => 'decimal:4',
            'hours_per_year' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Valores padrão usados ao criar as configurações de um novo usuário.
     * Espelham a aba "Parâmetros Gerais" da planilha original.
     */
    public static function defaults(): array
    {
        return [
            'kwh_price' => 0.85,
            'labor_rate' => 25.00,
            'failure_pct' => 0.05,
            'extra_material_pct' => 0.05,
            'tax_pct' => 0.06,
            'fee_pct' => 0.06,
            'margin_pct' => 0.50,
            'hours_per_year' => 1500,
        ];
    }
}
