<?php

namespace App\Http\Controllers;

use App\Actions\Auth\ExchangeGoogleAuthorizationCode;
use App\Actions\Auth\LinkGoogleAccount;
use App\Actions\Auth\UnlinkGoogleAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class GoogleConnectionController extends Controller
{
    public function store(
        Request $request,
        ExchangeGoogleAuthorizationCode $exchange,
        LinkGoogleAccount $linkGoogleAccount,
    ): JsonResponse {
        $request->validate(['code' => ['required', 'string']]);

        try {
            $googleUser = $exchange->handle();
        } catch (Throwable $e) {
            Log::error('Falha ao conectar conta Google.', ['exception' => $e]);

            return response()->json([
                'message' => 'Não foi possível conectar com o Google. Tente novamente.',
            ], 422);
        }

        try {
            $linkGoogleAccount->handle($request->user(), $googleUser);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        }

        return response()->json(['status' => 'google-connected']);
    }

    public function destroy(Request $request, UnlinkGoogleAccount $unlinkGoogleAccount): RedirectResponse
    {
        try {
            $unlinkGoogleAccount->handle($request->user());
        } catch (ValidationException $e) {
            return redirect()->route('profile.edit')->withErrors($e->errors());
        }

        return redirect()->route('profile.edit')->with('status', 'google-disconnected');
    }
}
