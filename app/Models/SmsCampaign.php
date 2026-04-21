<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Database\Factories\SmsCampaignFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'sim_id',
    'name',
    'message_template',
    'total_recipients',
    'sent_count',
    'delivered_count',
    'failed_count',
    'status',
    'scheduled_at',
    'started_at',
    'completed_at',
])]
class SmsCampaign extends Model
{
    /** @use HasFactory<SmsCampaignFactory> */
    use HasFactory;

    protected $table = 'sms_campaigns';

    protected function casts(): array
    {
        return [
            'status' => CampaignStatus::class,
            'scheduled_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
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

    public function recipients(): HasMany
    {
        return $this->hasMany(CampaignRecipient::class, 'campaign_id');
    }
}
