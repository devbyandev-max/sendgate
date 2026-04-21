<?php

namespace App\Jobs;

use App\Enums\MessageStatus;
use App\Models\SmsMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Stub-only: fakes carrier-side delivery so dashboards look alive in dev.
 */
class SimulateMessageDeliveryJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $smsMessageId) {}

    public function handle(): void
    {
        $sms = SmsMessage::find($this->smsMessageId);
        if (! $sms) {
            return;
        }

        if (random_int(1, 100) > 5) {
            $sms->update([
                'status' => MessageStatus::Delivered,
                'delivered_at' => now(),
            ]);
        } else {
            $sms->update([
                'status' => MessageStatus::Failed,
                'error_message' => 'Simulated carrier-side delivery failure.',
            ]);
        }
    }
}
