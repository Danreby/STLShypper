<?php

namespace App\Actions\Auth;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class CreateUserAccount
{
    public function handle(array $attributes): User
    {
        $user = User::create($attributes);

        Setting::create(array_merge(['user_id' => $user->id], Setting::defaults()));

        event(new Registered($user));

        return $user;
    }
}
