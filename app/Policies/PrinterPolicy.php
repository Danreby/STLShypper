<?php

namespace App\Policies;

use App\Models\Printer;
use App\Models\User;

class PrinterPolicy
{
    public function update(User $user, Printer $printer): bool
    {
        return $user->id === $printer->user_id;
    }

    public function delete(User $user, Printer $printer): bool
    {
        return $user->id === $printer->user_id;
    }
}
