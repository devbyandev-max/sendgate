<?php

namespace App\Http\Controllers\Gateway;

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Http\Controllers\Controller;
use App\Models\Sim;
use App\Models\SmsMessage;
use DateTimeInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;

/**
 * Callbacks pushed by the YX GP hardware gateway (manual sections 7.19 and 8.3.2).
 *
 * We accept both JSON and form-encoded payloads because the device's "SMS to HTTP"
 * setting supports either mode. Field names are normalised below.
 */
class CallbackController extends Controller
{
    /**
     * An inbound SMS the hardware just received on one of the SIMs.
     * Device sends fields like: sender, receiver, port, content, time.
     */
    public function inboundSms(Request $request): JsonResponse
    {
        $payload = $this->extract($request, ['sender', 'from', 'phone'], ['content', 'sms', 'message']);

        if (! $payload) {
            Log::warning('gateway.inbound_sms bad payload', ['body' => $request->getContent()]);

            return response()->json(['error' => 'Missing sender or content'], 422);
        }

        [$from, $message] = $payload;
        $port = (int) ($request->input('port') ?? $request->input('port_no') ?? 0);
        $receiver = (string) ($request->input('receiver') ?? $request->input('to') ?? '');
        $timeRaw = $request->input('time') ?? $request->input('scts');

        // Match by port first (most reliable), fall back to receiver phone.
        $sim = null;
        if ($port > 0) {
            $sim = Sim::where('port_number', $port)->first();
        }
        if (! $sim && $receiver !== '') {
            $sim = Sim::where('phone_number', $receiver)->first();
        }

        if (! $sim) {
            Log::warning('gateway.inbound_sms: no matching SIM', compact('port', 'receiver'));

            return response()->json(['error' => 'No matching SIM for this port/receiver'], 404);
        }

        $receivedAt = $this->parseTime($timeRaw);

        $sms = SmsMessage::create([
            'user_id' => $sim->user_id,
            'sim_id' => $sim->id,
            'direction' => MessageDirection::Inbound,
            'from_number' => $from,
            'to_number' => $sim->phone_number,
            'message' => $message,
            'status' => MessageStatus::Received,
            'segments' => (int) max(1, (int) ceil(mb_strlen($message) / 160)),
            'sent_at' => $receivedAt,
            'delivered_at' => $receivedAt,
            'provider_message_id' => 'yxgp-push:'.$request->input('id', uniqid('sms_', true)),
        ]);

        return response()->json(['ok' => true, 'id' => $sms->id]);
    }

    /**
     * A delivery report from the device for a previously-sent outbound SMS.
     * Device sends fields like: tid (our correlation id), status, time.
     */
    public function deliveryReport(Request $request): JsonResponse
    {
        $tid = $request->input('tid') ?? $request->input('task_id') ?? $request->input('id');
        $statusRaw = strtolower((string) ($request->input('status') ?? $request->input('state') ?? ''));

        if (! $tid) {
            return response()->json(['error' => 'Missing tid'], 422);
        }

        // We set provider_message_id to "yxgp:{tid}" when we queued the send.
        $sms = SmsMessage::where('provider_message_id', 'yxgp:'.$tid)->first();
        if (! $sms) {
            Log::info('gateway.dlr: unmatched tid', ['tid' => $tid]);

            return response()->json(['error' => 'Unknown tid'], 404);
        }

        // YX GP status strings are vendor-ish. Conservative mapping.
        $newStatus = match (true) {
            str_contains($statusRaw, 'ok'), str_contains($statusRaw, 'deliver') => MessageStatus::Delivered,
            str_contains($statusRaw, 'sent') => MessageStatus::Sent,
            str_contains($statusRaw, 'fail'), str_contains($statusRaw, 'error'), str_contains($statusRaw, 'reject') => MessageStatus::Failed,
            default => MessageStatus::Sent,
        };

        $updates = ['status' => $newStatus];
        $now = $this->parseTime($request->input('time'));

        if ($newStatus === MessageStatus::Delivered) {
            $updates['delivered_at'] = $now;
        }
        if ($newStatus === MessageStatus::Sent && ! $sms->sent_at) {
            $updates['sent_at'] = $now;
        }
        if ($newStatus === MessageStatus::Failed) {
            $updates['error_message'] = (string) $request->input('reason', $statusRaw);
        }

        $sms->update($updates);

        return response()->json(['ok' => true]);
    }

    /**
     * @param  list<string>  $fromKeys
     * @param  list<string>  $bodyKeys
     * @return array{0:string,1:string}|null
     */
    protected function extract(Request $request, array $fromKeys, array $bodyKeys): ?array
    {
        $from = null;
        foreach ($fromKeys as $k) {
            $v = $request->input($k);
            if (is_string($v) && $v !== '') {
                $from = $v;
                break;
            }
        }

        $body = null;
        foreach ($bodyKeys as $k) {
            $v = $request->input($k);
            if (is_string($v) && $v !== '') {
                $body = $v;
                break;
            }
        }

        if ($from === null || $body === null) {
            return null;
        }

        return [$from, $body];
    }

    protected function parseTime(mixed $raw): DateTimeInterface
    {
        if (! $raw) {
            return now();
        }

        try {
            return Date::parse((string) $raw);
        } catch (\Throwable) {
            return now();
        }
    }
}
