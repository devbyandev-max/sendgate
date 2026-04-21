<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        $admins = User::role(['admin', 'super_admin'])->with('roles:id,name')->latest()->get();

        return Inertia::render('admin/admins/index', ['admins' => $admins]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasRole('super_admin'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'in:admin,super_admin'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make(Str::random(32)),
            'email_verified_at' => now(),
        ]);
        $user->assignRole($data['role']);

        // TODO Phase 8: send password-set invitation email.
        return back()->with('toast', ['type' => 'success', 'message' => 'Admin created. (Send password reset to set their password.)']);
    }
}
