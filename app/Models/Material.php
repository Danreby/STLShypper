<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'type', 'color', 'price_per_kg', 'qtd', 'notes', 'purchase_url'];

    protected function casts(): array
    {
        return [
            'price_per_kg' => 'decimal:2',
            'qtd' => 'decimal:2',
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

    public function pricePerGram(): float
    {
        return (float) $this->price_per_kg / 1000;
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn (Builder $q, string $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($filters['type'] ?? null, fn (Builder $q, string $type) => $q->where('type', $type));
    }
}
