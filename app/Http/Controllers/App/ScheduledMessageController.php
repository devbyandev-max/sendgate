<?php

namespace App\Http\Controllers\App;

use App\Enums\ScheduledMessageStatus;
use App\Http\Controllers\Controller;
use App\Models\ScheduledMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduledMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $scheduled = $request->user()->scheduledMessages()
            ->where('status', ScheduledMessageStatus::Pending)
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('app/sms/scheduled', ['scheduled' => $scheduled]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'sim_id' => ['required', 'integer'],
            'to_number' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/'],
            'message' => ['required', 'string', 'max:1600'],
            'scheduled_at' => ['required', 'date', 'after:now'],
        ]);

        ScheduledMessage::create([
            'user_id' => $request->user()->id,
            'sim_id' => $data['sim_id'],
            'to_number' => $data['to_number'],
            'message' => $data['message'],
            'scheduled_at' => $data['scheduled_at'],
            'status' => ScheduledMessageStatus::Pending,
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Message scheduled.']);
    }

    public function destroy(Request $request, ScheduledMessage $message): RedirectResponse
    {
        abort_unless($message->user_id === $request->user()->id, 403);

        $message->update(['status' => ScheduledMessageStatus::Cancelled]);

        return back()->with('toast', ['type' => 'info', 'message' => 'Scheduled message cancelled.']);
    }
}
