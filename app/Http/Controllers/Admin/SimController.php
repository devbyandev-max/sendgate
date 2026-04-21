<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SimStatus;
use App\Http\Controllers\Controller;
use App\Models\Sim;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SimController extends Controller
{
    public function index(Request $request): Response
    {
        $sims = Sim::with('user:id,name,email')->latest()->paginate(50);
        $customers = User::role('customer')->get(['id', 'name', 'email']);

        return Inertia::render('admin/sims/index', [
            'sims' => $sims,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'iccid' => ['required', 'string', 'unique:sims,iccid'],
            'phone_number' => ['required', 'string'],
            'carrier' => ['required', 'in:globe,smart,dito,other'],
            'port_number' => ['nullable', 'integer'],
            'user_id' => ['nullable', 'exists:users,id'],
        ]);

        Sim::create([...$data, 'status' => SimStatus::Received]);

        return back()->with('toast', ['type' => 'success', 'message' => 'SIM added.']);
    }

    public function assign(Request $request, Sim $sim): RedirectResponse
    {
        $data = $request->validate(['user_id' => ['required', 'exists:users,id']]);
        $sim->update(['user_id' => $data['user_id']]);

        return back()->with('toast', ['type' => 'success', 'message' => 'SIM assigned to customer.']);
    }

    public function activate(Sim $sim): RedirectResponse
    {
        $sim->update(['status' => SimStatus::Active, 'activated_at' => now()]);

        return back()->with('toast', ['type' => 'success', 'message' => 'SIM activated.']);
    }
}
