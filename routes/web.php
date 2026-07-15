<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\GoogleConnectionController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\PrinterController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'dashboard' : 'login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perfil do usuário
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/google/redirect', [GoogleAuthController::class, 'redirectForLinking'])
        ->middleware('throttle:10,1')
        ->name('profile.google.redirect');

    Route::delete('/profile/google', [GoogleConnectionController::class, 'destroy'])
        ->name('profile.google.destroy');

    // Parâmetros Gerais
    Route::get('/parametros', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::patch('/parametros', [SettingsController::class, 'update'])->name('settings.update');

    // Impressoras
    Route::get('/impressoras', [PrinterController::class, 'index'])->name('printers.index');
    Route::post('/impressoras', [PrinterController::class, 'store'])->name('printers.store');
    Route::patch('/impressoras/{printer}', [PrinterController::class, 'update'])->name('printers.update');
    Route::delete('/impressoras/{printer}', [PrinterController::class, 'destroy'])->name('printers.destroy');

    // Materiais
    Route::get('/materiais', [MaterialController::class, 'index'])->name('materials.index');
    Route::post('/materiais', [MaterialController::class, 'store'])->name('materials.store');
    Route::patch('/materiais/{material}', [MaterialController::class, 'update'])->name('materials.update');
    Route::delete('/materiais/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');

    // Produtos
    Route::get('/produtos', [ProductController::class, 'index'])->name('products.index');
    Route::post('/produtos', [ProductController::class, 'store'])->name('products.store');
    Route::patch('/produtos/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/produtos/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Calculadora
    Route::get('/calculadora', [CalculatorController::class, 'index'])->name('calculator.index');
    Route::post('/calculadora/calcular', [CalculatorController::class, 'compute'])
        ->middleware('throttle:60,1')
        ->name('calculator.compute');

    // Exportação da planilha completa (Parâmetros, Impressoras, Materiais, Produtos, Resumo)
    Route::get('/exportar', [ExportController::class, 'index'])->name('export.index');
});

require __DIR__.'/auth.php';
