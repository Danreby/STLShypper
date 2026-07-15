<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ResolveGoogleUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use RuntimeException;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google after authentication.
     */
    public function callback(Request $request, ResolveGoogleUser $resolveGoogleUser): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = $resolveGoogleUser->handle($googleUser);
        } catch (InvalidStateException) {
            // Expired/replayed OAuth flow (e.g. the user reopened an old tab
            // or double-submitted); safe to just ask them to try again.
            return redirect()->route('login')
                ->with('status', 'Sessão de login com Google expirada. Tente novamente.');
        } catch (RuntimeException $e) {
            return redirect()->route('login')->withErrors(['email' => $e->getMessage()]);
        } catch (Throwable $e) {
            Log::error('Falha ao autenticar via Google.', ['exception' => $e]);

            return redirect()->route('login')
                ->with('status', 'Não foi possível entrar com o Google. Tente novamente.');
        }

        Auth::login($user, true);

        $request->session()->regenerate();

        return redirect(route('dashboard', absolute: false));
    }
}
