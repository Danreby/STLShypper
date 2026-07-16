<?php

namespace App\Models;

use App\Enums\PrinterTechnology;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FilamentType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'technology', 'color'];

    protected function casts(): array
    {
        return [
            'technology' => PrinterTechnology::class,
        ];
    }

    public function printers(): BelongsToMany
    {
        return $this->belongsToMany(Printer::class);
    }
}
