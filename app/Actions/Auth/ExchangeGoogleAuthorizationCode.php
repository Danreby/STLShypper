<?php

namespace App\Actions\Auth;

use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

class ExchangeGoogleAuthorizationCode
{
    /**
     * Exchange the `code` param on the current request for a Google profile.
     *
     * Used by the popup-based OAuth flow: the frontend gets the
     * authorization code directly from Google's JS client (no redirect_uri
     * round-trip through our server), so `stateless()` skips the
     * session-based state check (there's no prior redirect() call that
     * stored one), and `redirectUrl('postmessage')` matches the literal
     * value Google's popup code-client flow requires for the token exchange.
     */
    public function handle(): SocialiteUser
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirectUrl('postmessage')
            ->user();
    }
}
