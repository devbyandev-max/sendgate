<?php

namespace App\Http\Controllers\App;

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $from = now()->subDays(30);

        $totalSent = $user->smsMessages()->where('direction', MessageDirection::Outbound)->where('created_at', '>=', $from)->count();
        $delivered = $user->smsMessages()->where('status', MessageStatus::Delivered)->where('created_at', '>=', $from)->count();
        $failed = $user->smsMessages()->where('status', MessageStatus::Failed)->where('created_at', '>=', $from)->count();

        $byDay = $user->smsMessages()
            ->where('direction', MessageDirection::Outbound)
            ->where('created_at', '>=', $from)
            ->selectRaw('date(created_at) as day, count(*) as count')
            ->groupBy('day')->orderBy('day')->get();

        $bySim = $user->smsMessages()
            ->selectRaw('sim_id, count(*) as count')
            ->where('created_at', '>=', $from)
            ->groupBy('sim_id')->get();

        return Inertia::render('app/analytics', [
            'kpis' => [
                'total_sent' => $totalSent,
                'delivery_rate' => $totalSent > 0 ? round(($delivered / $totalSent) * 100, 1) : 0,
                'failed' => $failed,
                'active_sims' => $user->sims()->where('status', 'active')->count(),
            ],
            'by_day' => $byDay,
            'by_sim' => $bySim,
        ]);
    }
}
