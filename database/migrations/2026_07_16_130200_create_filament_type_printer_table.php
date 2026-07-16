<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filament_type_printer', function (Blueprint $table) {
            $table->foreignId('filament_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('printer_id')->constrained()->cascadeOnDelete();
            $table->primary(['filament_type_id', 'printer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filament_type_printer');
    }
};
