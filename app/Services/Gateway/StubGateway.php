<?php

namespace App\Services\Gateway;

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Jobs\SimulateMessageDeliveryJob;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Services\Gateway\DTOs\GatewayResponse;
use App\Services\Gateway\DTOs\SimStatus;
use Illuminate\Support\Str;

/**
 * Stub gateway used for local development and the MVP. Creates a DB row and
 * dispatches a job that fakes carrier delivery latency.
 */
class StubGateway implements GatewayInterface
{
    public function sendSms(Sim $sim, string $to, string $message): GatewayResponse
    {
        $segments = (int) max(1, (int) ceil(mb_strlen($message) / 160));

        $sms = SmsMessage::create([
            'user_id' => $sim->user_id,
            'sim_id' => $sim->id,
            'direction' => MessageDirection::Outbound,
            'from_number' => $sim->phone_number,
            'to_number' => $to,
            'message' => $message,
            'segments' => $segments,
            'status' => MessageStatus::Queued,
            'provider_message_id' => 'stub_'.Str::random(16),
            'sent_at' => now(),
        ]);

        SimulateMessageDeliveryJob::dispatch($sms->id)->delay(now()->addSeconds(random_int(2, 5)));

        return new GatewayResponse(
            success: true,
            providerMessageId: $sms->provider_message_id,
            status: MessageStatus::Queued->value,
            segments: $segments,
        );
    }

    public function getSimStatus(Sim $sim): SimStatus
    {
        return new SimStatus(
            online: $sim->status->value === 'active',
            signalStrength: random_int(70, 99),
            balance: '₱'.number_format(random_int(50, 500), 2),
            carrier: $sim->carrier->value,
        );
    }

    public function pollIncomingMessages(Sim $sim): array
    {
        // Stub does not poll — incoming messages are seeded for demos.
        return [];
    }
}
