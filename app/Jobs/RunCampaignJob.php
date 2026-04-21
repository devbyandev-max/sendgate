<?php

namespace App\Jobs;

use App\Enums\CampaignRecipientStatus;
use App\Enums\CampaignStatus;
use App\Models\SmsCampaign;
use App\Services\Gateway\GatewayInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RunCampaignJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $campaignId) {}

    public function handle(GatewayInterface $gateway): void
    {
        $campaign = SmsCampaign::with(['sim', 'recipients'])->find($this->campaignId);
        if (! $campaign || $campaign->status === CampaignStatus::Completed) {
            return;
        }

        $campaign->update([
            'status' => CampaignStatus::Running,
            'started_at' => now(),
        ]);

        foreach ($campaign->recipients()->where('status', CampaignRecipientStatus::Pending)->get() as $recipient) {
            $body = $campaign->message_template;
            foreach (($recipient->variables ?? []) as $key => $value) {
                $body = str_replace('{{'.$key.'}}', (string) $value, $body);
            }

            $gateway->sendSms($campaign->sim, $recipient->phone_number, $body);
            $recipient->update([
                'status' => CampaignRecipientStatus::Sent,
                'sent_at' => now(),
            ]);
            $campaign->increment('sent_count');
        }

        $campaign->update([
            'status' => CampaignStatus::Completed,
            'completed_at' => now(),
        ]);
    }
}
