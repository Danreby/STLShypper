<?php

namespace App\Enums;

enum PrinterTechnology: string
{
    case FDM = 'fdm';
    case RESIN = 'resin';

    public function label(): string
    {
        return match ($this) {
            self::FDM => 'Filamento (FDM)',
            self::RESIN => 'Resina (SLA/DLP/LCD)',
        };
    }
}
