<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class SettingsController extends Controller
{
    public function edit(): RedirectResponse
    {
        // Settings live under /settings/* (Profile, Security, Appearance) — redirect for convenience.
        return redirect()->route('profile.edit');
    }
}
