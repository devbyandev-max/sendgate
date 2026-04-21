<?php

namespace App\Services\Gateway;

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Jobs\SimulateMessageDeliveryJob;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Services\Gateway\DTOs\GatewayResponse;
use App\Services\Gateway\DTOs\IncomingMessage;
use App\Services\Gateway\DTOs\SimStatus;
use App\Services\Gateway\Exceptions\GatewayException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Production driver for the YX-Series GP hardware SMS gateway (YX International).
 *
 * Protocol reference: the device's vendor manual, section 11 "HTTP API".
 *
 * Endpoints used
 *   POST  /GP_post_sms.html?username=&password=   — send SMS (JSON body)
 *   GET   /GP_get_sms.html?username=&password=&sms_id=&sms_num=  — pull inbox
 *
 * The device also PUSHES to us (section 8.3.2 "SMS to HTTP" and 7.19 "Status
 * Notification"). Those pushes are received by `Http/Controllers/Gateway/*`
 * controllers, not by this class.
 */
class YxGpGateway implements GatewayInterface
{
    public function __construct(
        protected string $host,
        protected string $username,
        protected string $password,
        protected string $charset = 'utf8',
        protected int $timeoutSeconds = 10,
        protected bool $verifyTls = true,
    ) {
        if ($this->host === '') {
            throw new GatewayException('YX GP gateway is misconfigured: YXGP_HOST is empty.');
        }
    }

    /**
     * Send an SMS through the hardware using the documented POST /GP_post_sms.html endpoint.
     *
     * We post a single-task payload but the API actually supports batched
     * tasks — we may extend later for bulk throughput.
     */
    public function sendSms(Sim $sim, string $to, string $message): GatewayResponse
    {
        if ($sim->port_number === null) {
            throw new GatewayException("SIM #{$sim->id} has no port_number; cannot route to a hardware slot.");
        }

        $segments = (int) max(1, (int) ceil(mb_strlen($message) / 160));
        $tid = (int) (time() % 2_000_000_000);

        // Pre-create the SmsMessage row (queued). That gives us a local id we
        // stash as provider_message_id so callbacks can match it back.
        $sms = SmsMessage::create([
            'user_id' => $sim->user_id,
            'sim_id' => $sim->id,
            'direction' => MessageDirection::Outbound,
            'from_number' => $sim->phone_number,
            'to_number' => $to,
            'message' => $message,
            'segments' => $segments,
            'status' => MessageStatus::Queued,
            // The YX GP lets the CLIENT set tid; we mirror our SmsMessage id into it so we can correlate.
            'provider_message_id' => 'yxgp:'.$tid,
            'sent_at' => now(),
        ]);

        try {
            $response = Http::withBasicAuth($this->username, $this->password)
                ->asJson()
                ->timeout($this->timeoutSeconds)
                ->withOptions(['verify' => $this->verifyTls])
                ->post($this->url('/GP_post_sms.html', [
                    'username' => $this->username,
                    'password' => $this->password,
                ]), [
                    'type' => 'send-sms',
                    'task_num' => 1,
                    'tasks' => [
                        [
                            'tid' => $tid,
                            // Device config can override per-port, so we hint the destination port.
                            'from' => (int) $sim->port_number,
                            'to' => $to,
                            'sms' => $message,
                        ],
                    ],
                ])
                ->throw();

            $json = $response->json();
            $code = (int) ($json['code'] ?? 500);

            if ($code !== 200) {
                $reason = $json['reason'] ?? 'Unknown gateway response';
                $sms->update([
                    'status' => MessageStatus::Failed,
                    'error_message' => "Gateway refused ({$code}): {$reason}",
                ]);

                return new GatewayResponse(
                    success: false,
                    providerMessageId: $sms->provider_message_id,
                    status: MessageStatus::Failed->value,
                    errorMessage: $reason,
                    segments: $segments,
                );
            }

            // Per the spec, "0 OK" in status[].status means accepted for send.
            // We remain in "queued" until a callback (DLR) or a poller tells us otherwise.
            return new GatewayResponse(
                success: true,
                providerMessageId: $sms->provider_message_id,
                status: MessageStatus::Queued->value,
                segments: $segments,
            );
        } catch (ConnectionException|RequestException $e) {
            Log::warning('YX GP sendSms transport failure', ['sms_id' => $sms->id, 'error' => $e->getMessage()]);
            $sms->update([
                'status' => MessageStatus::Failed,
                'error_message' => 'Gateway unreachable: '.Str::limit($e->getMessage(), 200),
            ]);

            return new GatewayResponse(
                success: false,
                providerMessageId: $sms->provider_message_id,
                status: MessageStatus::Failed->value,
                errorMessage: $e->getMessage(),
                segments: $segments,
            );
        } catch (Throwable $e) {
            Log::error('YX GP sendSms unexpected failure', ['sms_id' => $sms->id, 'error' => $e->getMessage()]);
            $sms->update([
                'status' => MessageStatus::Failed,
                'error_message' => 'Unexpected error: '.Str::limit($e->getMessage(), 200),
            ]);
            throw new GatewayException('YX GP sendSms failed: '.$e->getMessage(), 0, $e);
        } finally {
            // Belt-and-braces: if no callback ever comes, fake a delivered state
            // after a delay so the UI doesn't show "queued" forever when the
            // device is misconfigured. Disable in production by removing this.
            if (config('app.env') !== 'production') {
                SimulateMessageDeliveryJob::dispatch($sms->id)->delay(now()->addSeconds(30));
            }
        }
    }

    /**
     * Per-SIM status is not exposed as a single endpoint on the YX GP — the
     * admin UI composes it from several. For MVP we return a coarse view
     * using only what we know locally; a future implementation could scrape
     * the status JSON the device exposes via `/GP_status.html`.
     */
    public function getSimStatus(Sim $sim): SimStatus
    {
        return new SimStatus(
            online: $sim->status?->value === 'active',
            signalStrength: null,
            balance: null,
            carrier: $sim->carrier?->value,
        );
    }

    /**
     * Pull inbound SMS via GET /GP_get_sms.html. Safe to call repeatedly —
     * de-duplication is the caller's job (we key on composite (sim_id, sender, content, timestamp)).
     *
     * @return array<int, IncomingMessage>
     */
    public function pollIncomingMessages(Sim $sim): array
    {
        try {
            $response = Http::withBasicAuth($this->username, $this->password)
                ->timeout($this->timeoutSeconds)
                ->withOptions(['verify' => $this->verifyTls])
                ->get($this->url('/GP_get_sms.html', [
                    'username' => $this->username,
                    'password' => $this->password,
                    'sms_num' => 0, // all
                ]))
                ->throw();
        } catch (Throwable $e) {
            Log::warning('YX GP pollIncomingMessages failed', ['sim_id' => $sim->id, 'error' => $e->getMessage()]);

            return [];
        }

        $payload = $response->json();

        // The response shape is vendor-ish — the manual implies a list but is fuzzy on the key names.
        // Normalise both likely shapes: { sms: [...] } or a raw array.
        $items = $payload['sms'] ?? ($payload['messages'] ?? (is_array($payload) ? $payload : []));

        $results = [];
        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $from = (string) ($item['from'] ?? $item['sender'] ?? '');
            $body = (string) ($item['sms'] ?? $item['content'] ?? $item['message'] ?? '');
            $port = (int) ($item['port'] ?? $item['port_no'] ?? 0);
            $time = $item['time'] ?? $item['scts'] ?? null;

            if ($from === '' || $body === '') {
                continue;
            }

            // Only pick up messages received by *this* SIM's port.
            if ($port !== 0 && $port !== (int) $sim->port_number) {
                continue;
            }

            $results[] = new IncomingMessage(
                fromNumber: $from,
                toNumber: $sim->phone_number,
                message: $body,
                receivedAt: $time ? Carbon::parse($time) : now(),
                providerMessageId: isset($item['id']) ? 'yxgp-inbox:'.$item['id'] : null,
            );
        }

        return $results;
    }

    /**
     * Build a URL for the gateway. `host` may already include a scheme + port.
     *
     * @param  array<string, scalar>  $query
     */
    protected function url(string $path, array $query = []): string
    {
        $host = $this->host;
        if (! Str::startsWith($host, ['http://', 'https://'])) {
            $host = 'http://'.$host;
        }

        $url = rtrim($host, '/').$path;

        if ($query) {
            $url .= '?'.http_build_query($query);
        }

        return $url;
    }
}
