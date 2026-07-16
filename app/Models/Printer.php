<?php

namespace App\Models;

use App\Enums\PrinterTechnology;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Printer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'technology', 'purchase_price', 'useful_life_hours', 'power_w', 'annual_maintenance', 'purchase_url',
    ];

    protected function casts(): array
    {
        return [
            'technology' => PrinterTechnology::class,
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

    public function filamentTypes(): BelongsToMany
    {
        return $this->belongsToMany(FilamentType::class);
    }

    public function depreciationPerHour(): float
    {
        $hours = (float) $this->useful_life_hours;

        return $hours > 0 ? (float) $this->purchase_price / $hours : 0.0;
    }

    public function maintenancePerHour(int $hoursPerYear): float
    {
        return $hoursPerYear > 0 ? (float) $this->annual_maintenance / $hoursPerYear : 0.0;
    }

    public function totalCostPerHour(int $hoursPerYear): float
    {
        return $this->depreciationPerHour() + $this->maintenancePerHour($hoursPerYear);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['search'] ?? null, fn (Builder $q, string $search) => $q->where('name', 'like', "%{$search}%"));
    }
}
