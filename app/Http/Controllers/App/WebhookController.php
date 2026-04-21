<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Webhook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WebhookController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('app/webhooks/index', [
            'webhooks' => $request->user()->webhooks()->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'url' => ['required', 'url'],
            'events' => ['required', 'array', 'min:1'],
            'events.*' => ['string'],
        ]);

        Webhook::create([
            'user_id' => $request->user()->id,
            'url' => $data['url'],
            'events' => $data['events'],
            'secret' => 'whsec_'.Str::random(32),
            'status' => 'active',
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Webhook created.']);
    }

    public function destroy(Request $request, Webhook $webhook): RedirectResponse
    {
        abort_unless($webhook->user_id === $request->user()->id, 403);
        $webhook->delete();

        return back()->with('toast', ['type' => 'info', 'message' => 'Webhook removed.']);
    }
}
