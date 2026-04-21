<?php

namespace App\Http\Controllers\App;

use App\Enums\MessageDirection;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(Request $request): Response
    {
        $messages = $request->user()->smsMessages()
            ->where('direction', MessageDirection::Inbound)
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('app/sms/inbox', ['messages' => $messages]);
    }
}
