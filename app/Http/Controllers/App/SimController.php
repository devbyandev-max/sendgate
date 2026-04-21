<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Sim;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SimController extends Controller
{
    public function index(Request $request): Response
    {
        $sims = $request->user()->sims()->latest()->get();

        return Inertia::render('app/sims/index', ['sims' => $sims]);
    }

    public function show(Request $request, Sim $sim): Response
    {
        abort_unless($sim->user_id === $request->user()->id, 403);

        $recent = $sim->smsMessages()->latest()->limit(20)->get();

        return Inertia::render('app/sims/show', [
            'sim' => $sim,
            'recent_messages' => $recent,
            'stats' => [
                'total_sent' => $sim->smsMessages()->where('direction', 'outbound')->count(),
                'total_received' => $sim->smsMessages()->where('direction', 'inbound')->count(),
            ],
        ]);
    }
}
