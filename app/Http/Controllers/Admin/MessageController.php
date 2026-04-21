<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmsMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $messages = SmsMessage::with(['user:id,name,email', 'sim:id,phone_number'])
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('admin/messages/index', ['messages' => $messages]);
    }
}
