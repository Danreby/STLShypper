<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Two\User as SocialiteUser;
use RuntimeException;

class ResolveGoogleUser
{
    public function __construct(
        private readonly CreateUserAccount $creator,
        private readonly EnsureGoogleEmailIsVerified $emailVerifier,
    ) {
    }

    public function handle(SocialiteUser $googleUser): User
    {
        if (! $this->emailVerifier->handle($googleUser)) {
            throw new RuntimeException('O e-mail da conta Google não está verificado.');
        }

        return DB::transaction(function () use ($googleUser) {
            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                return $user;
            }

            $user = User::where('email', $googleUser->getEmail())->lockForUpdate()->first();

            if ($user) {
                $user->forceFill([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ])->save();

                return $user;
            }

            return $this->creator->handle([
                'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: $googleUser->getEmail(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => null,
                'email_verified_at' => now(),
            ]);
        });
    }
}
