<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'type', 'price_per_kg', 'notes', 'purchase_url'];

    protected function casts(): array
    {
        return [
            'price_per_kg' => 'decimal:2',
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
     * Preço por grama (R$/g) = Preço por kg / 1000.
     */
    public function pricePerGram(): float
    {
        return (float) $this->price_per_kg / 1000;
    }
}
