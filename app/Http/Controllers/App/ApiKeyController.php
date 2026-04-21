<?php

namespace App\Http\Controllers\App;

use App\Enums\ApiKeyStatus;
use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApiKeyController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('app/api-keys/index', [
            'keys' => $request->user()->apiKeys()->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $apiKey = ApiKey::generate($request->user(), $data['name']);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Key created. Copy the full key now — it will not be shown again.',
        ])->with('new_api_key', [
            'name' => $apiKey->name,
            'prefix' => $apiKey->key_prefix,
            'plaintext' => $apiKey->plaintext,
        ]);
    }

    public function destroy(Request $request, ApiKey $apiKey): RedirectResponse
    {
        abort_unless($apiKey->user_id === $request->user()->id, 403);
        $apiKey->update(['status' => ApiKeyStatus::Revoked]);

        return back()->with('toast', ['type' => 'info', 'message' => 'API key revoked.']);
    }
}
