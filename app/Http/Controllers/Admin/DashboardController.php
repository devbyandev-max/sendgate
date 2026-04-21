<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentProofStatus;
use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PaymentProof;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $mrr = (float) Invoice::where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('amount_php');

        $signups = User::role('customer')->latest()->limit(5)->get(['id', 'name', 'email', 'company_name', 'created_at']);
        $pendingProofs = PaymentProof::where('status', PaymentProofStatus::Pending)
            ->with(['user:id,name,email', 'invoice:id,invoice_number,amount_php'])
            ->latest('uploaded_at')->limit(5)->get();

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'mrr_php' => $mrr,
                'active_sims' => Sim::where('status', SimStatus::Active)->count(),
                'active_customers' => User::role('customer')->where('status', 'active')->count(),
                'pending_payments' => PaymentProof::where('status', PaymentProofStatus::Pending)->count(),
                'messages_24h' => SmsMessage::where('created_at', '>=', now()->subDay())->count(),
            ],
            'recent_signups' => $signups,
            'pending_payments' => $pendingProofs,
        ]);
    }
}
