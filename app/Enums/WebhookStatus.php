<?php

namespace App\Enums;

enum WebhookStatus: string
{
    case Active = 'active';
    case Paused = 'paused';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Paused => 'Paused',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Paused => 'muted',
        };
    }
}
