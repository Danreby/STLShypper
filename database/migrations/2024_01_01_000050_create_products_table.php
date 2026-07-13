<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('printer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('material_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->decimal('piece_weight_g', 10, 2)->default(0);
            $table->decimal('print_time_h', 10, 2)->default(0);
            $table->decimal('labor_cost', 10, 2)->default(0);
            $table->decimal('extra_fixed_costs', 10, 2)->default(0);
            $table->unsignedInteger('quantity')->default(1);

            // Overrides opcionais (se nulos, usa os Parâmetros Gerais do usuário)
            $table->decimal('extra_material_pct', 6, 4)->nullable();
            $table->decimal('failure_pct', 6, 4)->nullable();
            $table->decimal('tax_pct', 6, 4)->nullable();
            $table->decimal('fee_pct', 6, 4)->nullable();
            $table->decimal('margin_pct', 6, 4)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
