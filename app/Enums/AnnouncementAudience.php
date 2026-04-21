<?php

namespace App\Enums;

enum AnnouncementAudience: string
{
    case All = 'all';
    case Active = 'active';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::All => 'All customers',
            self::Active => 'Active customers',
            self::Suspended => 'Suspended customers',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::All => 'info',
            self::Active => 'success',
            self::Suspended => 'warning',
        };
    }
}
