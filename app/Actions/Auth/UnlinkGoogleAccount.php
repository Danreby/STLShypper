<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class UnlinkGoogleAccount
{
    public function handle(User $user): void
    {
        if (is_null($user->password)) {
            throw ValidationException::withMessages([
                'google' => 'Defina uma senha antes de desconectar sua conta Google, para não perder o acesso à sua conta.',
            ]);
        }

        $user->forceFill([
            'google_id' => null,
            'avatar' => null,
        ])->save();
    }
}
