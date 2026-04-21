<?php

namespace App\Models;

use App\Enums\ScheduledMessageStatus;
use Database\Factories\ScheduledMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'sim_id',
    'to_number',
    'message',
    'scheduled_at',
    'status',
    'sent_at',
    'sms_message_id',
])]
class ScheduledMessage extends Model
{
    /** @use HasFactory<ScheduledMessageFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => ScheduledMessageStatus::class,
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sim(): BelongsTo
    {
        return $this->belongsTo(Sim::class);
    }

    public function smsMessage(): BelongsTo
    {
        return $this->belongsTo(SmsMessage::class);
    }
}
