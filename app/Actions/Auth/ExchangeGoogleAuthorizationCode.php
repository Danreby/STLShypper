<?php

namespace App\Actions\Auth;

use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

class ExchangeGoogleAuthorizationCode
{
    public function handle(): SocialiteUser
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirectUrl('postmessage')
            ->user();
    }
}
