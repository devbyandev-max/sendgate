<?php

namespace App\Http\Controllers\App;

use App\Enums\MessageDirection;
use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Services\Gateway\GatewayInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Virtual "conversation" view over sms_messages, grouped by (sim_id, remote number).
 * No conversations table — everything is derived.
 */
class ConversationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeThreadKey = $this->normaliseThreadKey($request->query('thread'));

        $conversations = $this->conversationsFor($user->id);

        $activeConversation = null;
        $messages = [];

        if ($activeThreadKey && isset($conversations[$activeThreadKey])) {
            $activeConversation = $conversations[$activeThreadKey];
            $messages = $this->messagesFor($user->id, $activeConversation['sim_id'], $activeConversation['remote_number']);
        }

        $sims = $user->sims()
            ->where('status', SimStatus::Active)
            ->get(['id', 'phone_number', 'label', 'carrier']);

        return Inertia::render('app/conversations/index', [
            'conversations' => array_values($conversations),
            'active_thread' => $activeThreadKey,
            'active_conversation' => $activeConversation,
            'messages' => $messages,
            'sims' => $sims,
        ]);
    }

    public function store(Request $request, GatewayInterface $gateway): RedirectResponse
    {
        $data = $request->validate([
            'sim_id' => ['required', 'integer'],
            'to' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/'],
            'message' => ['required', 'string', 'max:1600'],
        ], [
            'to.regex' => 'Please enter a valid Philippine mobile number.',
        ]);

        $sim = $request->user()
            ->sims()
            ->where('status', SimStatus::Active)
            ->findOrFail($data['sim_id']);

        $gateway->sendSms($sim, $data['to'], $data['message']);

        $threadKey = $data['sim_id'].':'.$this->normalisePhone($data['to']);

        return redirect()
            ->route('app.conversations.index', ['thread' => $threadKey])
            ->with('toast', ['type' => 'success', 'message' => 'Message sent.']);
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    protected function conversationsFor(int $userId): array
    {
        // Compute the "remote" number per message: to_number if outbound, else from_number.
        $rows = DB::table('sms_messages')
            ->select([
                'sim_id',
                DB::raw("CASE WHEN direction = 'outbound' THEN to_number ELSE from_number END as remote_number"),
                'direction',
                'message',
                'status',
                'created_at',
            ])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        $conversations = [];

        foreach ($rows as $row) {
            $remote = $row->remote_number;
            $key = $row->sim_id.':'.$remote;

            if (! isset($conversations[$key])) {
                $conversations[$key] = [
                    'thread' => $key,
                    'sim_id' => (int) $row->sim_id,
                    'remote_number' => $remote,
                    'last_message' => $row->message,
                    'last_direction' => $row->direction,
                    'last_status' => $row->status,
                    'last_message_at' => $row->created_at,
                    'inbound_count' => 0,
                    'outbound_count' => 0,
                    'unread' => false,
                ];
            }

            if ($row->direction === MessageDirection::Inbound->value) {
                $conversations[$key]['inbound_count']++;
            } else {
                $conversations[$key]['outbound_count']++;
            }
        }

        // Decorate with SIM info (single query, not N+1)
        $simIds = array_unique(array_map(fn ($c) => $c['sim_id'], $conversations));
        $sims = $simIds
            ? Sim::whereIn('id', $simIds)->get(['id', 'phone_number', 'carrier', 'label'])->keyBy('id')
            : collect();

        foreach ($conversations as &$conv) {
            $sim = $sims->get($conv['sim_id']);
            $conv['sim_phone'] = $sim?->phone_number;
            $conv['sim_carrier'] = $sim?->carrier?->value;
            $conv['sim_label'] = $sim?->label;
            // "Unread" proxy: latest message is inbound AND received within last 24h (no unread table yet).
            $conv['unread'] = $conv['last_direction'] === MessageDirection::Inbound->value
                && strtotime((string) $conv['last_message_at']) > strtotime('-24 hours');
        }

        return $conversations;
    }

    protected function messagesFor(int $userId, int $simId, string $remote)
    {
        return SmsMessage::query()
            ->where('user_id', $userId)
            ->where('sim_id', $simId)
            ->where(function ($q) use ($remote) {
                $q->where('to_number', $remote)
                    ->orWhere('from_number', $remote);
            })
            ->orderBy('created_at')
            ->get(['id', 'direction', 'from_number', 'to_number', 'message', 'status', 'segments', 'sent_at', 'delivered_at', 'created_at']);
    }

    protected function normaliseThreadKey(mixed $raw): ?string
    {
        if (! is_string($raw) || $raw === '') {
            return null;
        }

        [$sim, $phone] = array_pad(explode(':', $raw, 2), 2, null);

        if (! ctype_digit((string) $sim) || ! $phone) {
            return null;
        }

        return ((int) $sim).':'.$this->normalisePhone($phone);
    }

    protected function normalisePhone(string $phone): string
    {
        // Messages store phone numbers as-is (mix of +639… and 09…). Equality matters for grouping,
        // so we just trim.
        return trim($phone);
    }
}
