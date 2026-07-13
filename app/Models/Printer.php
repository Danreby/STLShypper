<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name', 'purchase_price', 'useful_life_hours', 'power_w', 'annual_maintenance',
])]
class Printer extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'useful_life_hours' => 'integer',
            'power_w' => 'integer',
            'annual_maintenance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Depreciação por hora (R$/h) = Preço de compra / Vida útil (h).
     */
    public function depreciationPerHour(): float
    {
        $hours = (float) $this->useful_life_hours;

        return $hours > 0 ? (float) $this->purchase_price / $hours : 0.0;
    }

    /**
     * Manutenção por hora (R$/h) = Manutenção anual / Horas de uso por ano.
     */
    public function maintenancePerHour(int $hoursPerYear): float
    {
        return $hoursPerYear > 0 ? (float) $this->annual_maintenance / $hoursPerYear : 0.0;
    }

    /**
     * Custo total de máquina por hora (R$/h) = depreciação/h + manutenção/h.
     */
    public function totalCostPerHour(int $hoursPerYear): float
    {
        return $this->depreciationPerHour() + $this->maintenancePerHour($hoursPerYear);
    }
}
