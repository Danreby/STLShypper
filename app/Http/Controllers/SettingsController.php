<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Parâmetros Gerais de precificação (aba "Parâmetros Gerais" da planilha):
 * valor do kWh, mão de obra, % de perdas, impostos, taxas e margem padrão.
 */
class SettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $settings = $request->user()->setting
            ?? Setting::create(array_merge(['user_id' => $request->user()->id], Setting::defaults()));

        return Inertia::render('Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'kwh_price' => ['required', 'numeric', 'min:0'],
            'labor_rate' => ['required', 'numeric', 'min:0'],
            'failure_pct' => ['required', 'numeric', 'min:0', 'max:0.9999'],
            'extra_material_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'tax_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'hours_per_year' => ['required', 'integer', 'min:1'],
        ]);

        $settings = $request->user()->setting
            ?? Setting::create(array_merge(['user_id' => $request->user()->id], Setting::defaults()));

        $settings->update($data);

        return back()->with('success', 'Parâmetros gerais atualizados com sucesso.');
    }
}
