<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $monthlyRevenue = Invoice::query()
            ->where('status', InvoiceStatus::Paid)
            ->where('paid_at', '>=', now()->subMonths(11)->startOfMonth())
            ->selectRaw("strftime('%Y-%m', paid_at) as month, sum(amount_php) as total")
            ->groupBy('month')->orderBy('month')->get();

        $newCustomers = User::role('customer')
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->selectRaw("strftime('%Y-%m', created_at) as month, count(*) as count")
            ->groupBy('month')->orderBy('month')->get();

        return Inertia::render('admin/analytics', [
            'revenue_by_month' => $monthlyRevenue,
            'new_customers_by_month' => $newCustomers,
        ]);
    }
}
