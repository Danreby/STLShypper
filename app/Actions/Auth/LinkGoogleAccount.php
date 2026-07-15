<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Two\User as SocialiteUser;

class LinkGoogleAccount
{
    public function __construct(private readonly EnsureGoogleEmailIsVerified $emailVerifier)
    {
    }

    public function handle(User $user, SocialiteUser $googleUser): void
    {
        if (! $this->emailVerifier->handle($googleUser)) {
            throw ValidationException::withMessages([
                'google' => 'O e-mail da conta Google não está verificado.',
            ]);
        }

        $linkedToAnotherUser = User::where('google_id', $googleUser->getId())
            ->whereKeyNot($user->getKey())
            ->exists();

        if ($linkedToAnotherUser) {
            throw ValidationException::withMessages([
                'google' => 'Essa conta Google já está vinculada a outro usuário.',
            ]);
        }

        $user->forceFill([
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();
    }
}
