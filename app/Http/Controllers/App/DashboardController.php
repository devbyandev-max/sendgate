<?php

namespace App\Http\Controllers\App;

use App\Enums\InvoiceStatus;
use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $activeSims = $user->sims()->where('status', SimStatus::Active)->count();
        $sent30d = $user->smsMessages()
            ->where('direction', MessageDirection::Outbound)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
        $delivered30d = $user->smsMessages()
            ->where('direction', MessageDirection::Outbound)
            ->where('status', MessageStatus::Delivered)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
        $deliveryRate = $sent30d > 0 ? round(($delivered30d / $sent30d) * 100, 1) : 0;

        $pendingInvoices = (float) $user->invoices()
            ->whereIn('status', [InvoiceStatus::Pending, InvoiceStatus::Overdue])
            ->sum('amount_php');

        $recent = $user->smsMessages()
            ->latest()
            ->limit(10)
            ->get(['id', 'direction', 'to_number', 'from_number', 'message', 'status', 'created_at']);

        $messagesOverTime = $user->smsMessages()
            ->where('direction', MessageDirection::Outbound)
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('date(created_at) as day, count(*) as count')
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $deliveryBreakdown = $user->smsMessages()
            ->where('direction', MessageDirection::Outbound)
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $pendingInvoice = $user->invoices()
            ->where('status', InvoiceStatus::Pending)
            ->orderBy('due_date')
            ->first();

        return Inertia::render('app/dashboard', [
            'stats' => [
                'active_sims' => $activeSims,
                'sent_30d' => $sent30d,
                'delivery_rate' => $deliveryRate,
                'pending_php' => $pendingInvoices,
            ],
            'recent_messages' => $recent,
            'charts' => [
                'messages_over_time' => $messagesOverTime,
                'delivery_breakdown' => $deliveryBreakdown,
            ],
            'pending_invoice' => $pendingInvoice,
        ]);
    }
}
