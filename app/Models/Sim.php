<?php

namespace App\Models;

use App\Enums\SimCarrier;
use App\Enums\SimStatus;
use Database\Factories\SimFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id',
    'iccid',
    'phone_number',
    'carrier',
    'port_number',
    'label',
    'status',
    'activated_at',
    'notes',
])]
class Sim extends Model
{
    /** @use HasFactory<SimFactory> */
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'carrier' => SimCarrier::class,
            'status' => SimStatus::class,
            'activated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function smsMessages(): HasMany
    {
        return $this->hasMany(SmsMessage::class);
    }

    public function scheduledMessages(): HasMany
    {
        return $this->hasMany(ScheduledMessage::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', SimStatus::Active);
    }
}
