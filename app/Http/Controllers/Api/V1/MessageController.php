<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ScheduledMessageStatus;
use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use App\Models\ScheduledMessage;
use App\Models\SmsMessage;
use App\Services\Gateway\GatewayInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = $request->user()->smsMessages()
            ->latest()
            ->paginate(min(100, max(1, (int) $request->query('per_page', 25))));

        return response()->json([
            'data' => $messages->items(),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
                'last_page' => $messages->lastPage(),
            ],
        ]);
    }

    public function show(Request $request, SmsMessage $message): JsonResponse
    {
        if ($message->user_id !== $request->user()->id) {
            return $this->error(404, 'not_found', 'Message not found.');
        }

        return response()->json(['data' => $message]);
    }

    public function store(Request $request, GatewayInterface $gateway): JsonResponse
    {
        $validator = validator($request->all(), [
            'sim_id' => ['required', 'integer'],
            'to' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/'],
            'message' => ['required', 'string', 'max:1600'],
        ]);

        if ($validator->fails()) {
            return $this->error(422, 'validation_failed', 'Validation failed.', $validator->errors()->toArray());
        }

        $sim = $request->user()->sims()->where('status', SimStatus::Active)->find($request->input('sim_id'));
        if (! $sim) {
            return $this->error(404, 'not_found', 'SIM not found or not active.');
        }

        $response = $gateway->sendSms($sim, $request->input('to'), $request->input('message'));

        return response()->json([
            'data' => [
                'provider_message_id' => $response->providerMessageId,
                'status' => $response->status,
                'segments' => $response->segments,
            ],
        ], 201);
    }

    public function schedule(Request $request): JsonResponse
    {
        $validator = validator($request->all(), [
            'sim_id' => ['required', 'integer'],
            'to' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/'],
            'message' => ['required', 'string', 'max:1600'],
            'scheduled_at' => ['required', 'date', 'after:now'],
        ]);

        if ($validator->fails()) {
            return $this->error(422, 'validation_failed', 'Validation failed.', $validator->errors()->toArray());
        }

        $sim = $request->user()->sims()->where('status', SimStatus::Active)->findOrFail($request->input('sim_id'));

        $message = ScheduledMessage::create([
            'user_id' => $request->user()->id,
            'sim_id' => $sim->id,
            'to_number' => $request->input('to'),
            'message' => $request->input('message'),
            'scheduled_at' => $request->input('scheduled_at'),
            'status' => ScheduledMessageStatus::Pending,
        ]);

        return response()->json(['data' => $message], 201);
    }

    protected function error(int $status, string $code, string $message, ?array $details = null): JsonResponse
    {
        $payload = ['code' => $code, 'message' => $message];
        if ($details) {
            $payload['details'] = $details;
        }

        return response()->json(['error' => $payload], $status);
    }
}
