<?php

namespace App\Actions\Auth;

use Laravel\Socialite\Two\User as SocialiteUser;

class EnsureGoogleEmailIsVerified
{
    public function handle(SocialiteUser $googleUser): bool
    {
        $raw = $googleUser->getRaw();

        return filter_var($raw['email_verified'] ?? false, FILTER_VALIDATE_BOOL);
    }
}
