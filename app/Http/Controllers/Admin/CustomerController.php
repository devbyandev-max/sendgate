<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $q = (string) $request->query('q', '');
        $customers = User::role('customer')
            ->withCount(['sims', 'invoices'])
            ->when($q, fn ($qq) => $qq->where('name', 'like', "%$q%")->orWhere('email', 'like', "%$q%"))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => ['q' => $q],
        ]);
    }

    public function show(User $customer): Response
    {
        return Inertia::render('admin/customers/show', [
            'customer' => $customer->load(['sims', 'invoices', 'subscriptions.sim']),
        ]);
    }

    public function suspend(User $customer): RedirectResponse
    {
        $customer->update(['status' => 'suspended']);

        return back()->with('toast', ['type' => 'success', 'message' => 'Customer suspended.']);
    }

    public function activate(User $customer): RedirectResponse
    {
        $customer->update(['status' => 'active']);

        return back()->with('toast', ['type' => 'success', 'message' => 'Customer activated.']);
    }
}
