<?php

namespace App\Http\Controllers;

use App\Http\Requests\Setting\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Services\UserSettingsResolver;
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
    public function __construct(private readonly UserSettingsResolver $settingsResolver)
    {
    }

    public function edit(Request $request): Response
    {
        $settings = $this->settingsResolver->forUser($request->user());

        return Inertia::render('Settings', [
            'settings' => new SettingResource($settings),
        ]);
    }

    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        $settings = $this->settingsResolver->forUser($request->user());
        $settings->update($request->validated());

        return back()->with('success', 'Parâmetros gerais atualizados com sucesso.');
    }
}
