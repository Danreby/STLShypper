<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ExchangeGoogleAuthorizationCode;
use App\Actions\Auth\ResolveGoogleUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Log in or register a user from a Google popup's authorization code.
     */
    public function exchange(
        Request $request,
        ExchangeGoogleAuthorizationCode $exchange,
        ResolveGoogleUser $resolveGoogleUser,
    ): JsonResponse {
        $request->validate(['code' => ['required', 'string']]);

        try {
            $googleUser = $exchange->handle();
        } catch (Throwable $e) {
            Log::error('Falha ao autenticar via Google.', ['exception' => $e]);

            return response()->json([
                'message' => 'Não foi possível entrar com o Google. Tente novamente.',
            ], 422);
        }

        try {
            $user = $resolveGoogleUser->handle($googleUser);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        Auth::login($user, true);

        $request->session()->regenerate();

        return response()->json(['redirect' => route('dashboard', absolute: false)]);
    }
}
