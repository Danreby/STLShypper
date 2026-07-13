<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('kwh_price', 10, 4)->default(0.85);
            $table->decimal('labor_rate', 10, 2)->default(25);
            $table->decimal('failure_pct', 6, 4)->default(0.05);
            $table->decimal('extra_material_pct', 6, 4)->default(0.05);
            $table->decimal('tax_pct', 6, 4)->default(0.06);
            $table->decimal('fee_pct', 6, 4)->default(0.06);
            $table->decimal('margin_pct', 6, 4)->default(0.50);
            $table->unsignedInteger('hours_per_year')->default(1500);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
