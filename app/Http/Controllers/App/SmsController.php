<?php

namespace App\Http\Controllers\App;

use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use App\Services\Gateway\GatewayInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SmsController extends Controller
{
    public function create(Request $request): Response
    {
        $sims = $request->user()
            ->sims()
            ->where('status', SimStatus::Active)
            ->get(['id', 'phone_number', 'label', 'carrier']);

        return Inertia::render('app/sms/send', ['sims' => $sims]);
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

        $sim = $request->user()->sims()->where('status', SimStatus::Active)->findOrFail($data['sim_id']);
        $gateway->sendSms($sim, $data['to'], $data['message']);

        return redirect()
            ->route('app.sms.outbox.index')
            ->with('toast', ['type' => 'success', 'message' => 'Message queued — it will appear in Outbox momentarily.']);
    }

    public function bulkStore(Request $request, GatewayInterface $gateway): RedirectResponse
    {
        $data = $request->validate([
            'sim_id' => ['required', 'integer'],
            'recipients' => ['required', 'array', 'min:1', 'max:1000'],
            'recipients.*' => ['regex:/^(\\+63|0)9\\d{9}$/'],
            'message' => ['required', 'string', 'max:1600'],
        ]);

        $sim = $request->user()->sims()->where('status', SimStatus::Active)->findOrFail($data['sim_id']);
        foreach ($data['recipients'] as $to) {
            $gateway->sendSms($sim, $to, $data['message']);
        }

        return redirect()
            ->route('app.sms.outbox.index')
            ->with('toast', ['type' => 'success', 'message' => count($data['recipients']).' messages queued.']);
    }
}
