<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Two\User as SocialiteUser;
use RuntimeException;

class ResolveGoogleUser
{
    public function __construct(private readonly CreateUserAccount $creator)
    {
    }

    /**
     * Find, link, or create the local user for a Google Socialite user.
     *
     * Runs inside a transaction so two simultaneous callbacks for the same
     * brand-new email can't both slip past the lookup and create duplicate
     * accounts (the unique index on google_id/email is the last line of
     * defense, but this avoids racing the account-provisioning side effects).
     */
    public function handle(SocialiteUser $googleUser): User
    {
        if (! $this->emailIsVerifiedByGoogle($googleUser)) {
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

    /**
     * Google's OpenID Connect payload carries its own "email_verified" claim.
     *
     * Trusting getEmail() alone would let an account under a misconfigured
     * Google Workspace domain (unverified email) hijack a local account that
     * happens to share that address, so this claim is checked before any
     * lookup/link/create decision is made.
     */
    private function emailIsVerifiedByGoogle(SocialiteUser $googleUser): bool
    {
        $raw = $googleUser->getRaw();

        return filter_var($raw['email_verified'] ?? false, FILTER_VALIDATE_BOOL);
    }
}
