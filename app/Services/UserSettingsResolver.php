<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;

class UserSettingsResolver
{
    /**
     * Retorna os Parâmetros Gerais do usuário, criando-os com os valores
     * padrão na primeira vez que forem necessários.
     */
    public function forUser(User $user): Setting
    {
        return $user->setting ?? Setting::create(array_merge(
            ['user_id' => $user->id],
            Setting::defaults()
        ));
    }
}
