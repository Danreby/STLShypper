<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;

class UserSettingsResolver
{
    public function forUser(User $user): Setting
    {
        return $user->setting ?? Setting::create(array_merge(
            ['user_id' => $user->id],
            Setting::defaults()
        ));
    }
}
