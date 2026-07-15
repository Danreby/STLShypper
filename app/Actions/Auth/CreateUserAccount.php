<?php

namespace App\Actions\Auth;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class CreateUserAccount
{
    /**
     * Create a user and its default Settings row, then fire the Registered event.
     *
     * Single entry point for account creation so every path (normal
     * registration, Google sign-in, future providers) provisions a user the
     * same way and never forgets the default Setting row.
     */
    public function handle(array $attributes): User
    {
        $user = User::create($attributes);

        Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        event(new Registered($user));

        return $user;
    }
}
