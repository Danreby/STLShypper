<?php

namespace App\Providers;

use App\Models\Material;
use App\Models\Printer;
use App\Models\Product;
use App\Policies\MaterialPolicy;
use App\Policies\PrinterPolicy;
use App\Policies\ProductPolicy;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Material::class, MaterialPolicy::class);
        Gate::policy(Printer::class, PrinterPolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);

        JsonResource::withoutWrapping();
    }
}
