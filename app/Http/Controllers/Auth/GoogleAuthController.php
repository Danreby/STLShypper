<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\LinkGoogleAccount;
use App\Actions\Auth\ResolveGoogleUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $request->session()->forget('google_intent');

        return $this->googleRedirect();
    }

    public function redirectForLinking(Request $request): RedirectResponse
    {
        $request->session()->put('google_intent', 'link');

        return $this->googleRedirect();
    }

    /**
     * Ask Google to deliver the callback via an auto-submitting POST instead
     * of a GET with a long query string. Some hosts' WAF (e.g. Imunify360 on
     * shared cPanel hosting) blocks the default GET callback with a 406,
     * because Google's echoed `scope` param contains full googleapis.com
     * URLs and generic WAF rules scrutinize query strings far more
     * aggressively than POST bodies.
     */
    private function googleRedirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with(['response_mode' => 'form_post'])
            ->redirect();
    }

    public function callback(
        Request $request,
        ResolveGoogleUser $resolveGoogleUser,
        LinkGoogleAccount $linkGoogleAccount,
    ): RedirectResponse {
        $intent = $request->session()->pull('google_intent', 'login');

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidStateException) {
            return redirect()->route($intent === 'link' ? 'profile.edit' : 'login')
                ->with('status', 'Sessão do Google expirada. Tente novamente.');
        } catch (Throwable $e) {
            Log::error('Falha ao autenticar via Google.', ['exception' => $e]);

            return redirect()->route($intent === 'link' ? 'profile.edit' : 'login')
                ->with('status', 'Não foi possível se conectar com o Google. Tente novamente.');
        }

        if ($intent === 'link') {
            if (! Auth::check()) {
                return redirect()->route('login');
            }

            try {
                $linkGoogleAccount->handle($request->user(), $googleUser);
            } catch (ValidationException $e) {
                return redirect()->route('profile.edit')->withErrors($e->errors());
            }

            return redirect()->route('profile.edit')->with('status', 'google-connected');
        }

        try {
            $user = $resolveGoogleUser->handle($googleUser);
        } catch (RuntimeException $e) {
            return redirect()->route('login')->withErrors(['email' => $e->getMessage()]);
        }

        Auth::login($user, true);

        $request->session()->regenerate();

        return redirect(route('dashboard', absolute: false));
    }
}
