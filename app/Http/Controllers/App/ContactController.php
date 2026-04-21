<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $q = (string) $request->query('q', '');
        $contacts = $request->user()->contacts()
            ->when($q, fn ($qq) => $qq->where(function ($qq) use ($q) {
                $qq->where('name', 'like', "%$q%")
                    ->orWhere('phone_number', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            }))
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('app/contacts/index', [
            'contacts' => $contacts,
            'filters' => ['q' => $q],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/',
                Rule::unique('contacts', 'phone_number')->where(fn ($q) => $q->where('user_id', $user->id)),
            ],
            'email' => ['nullable', 'email'],
        ]);

        Contact::create([...$data, 'user_id' => $user->id]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Contact added.']);
    }

    public function destroy(Request $request, Contact $contact): RedirectResponse
    {
        abort_unless($contact->user_id === $request->user()->id, 403);
        $contact->delete();

        return back()->with('toast', ['type' => 'info', 'message' => 'Contact removed.']);
    }

    public function import(Request $request): RedirectResponse
    {
        // CSV import stubbed for MVP — future: league/csv file upload + column mapping.
        return back()->with('toast', ['type' => 'info', 'message' => 'CSV import will be wired in a future release.']);
    }
}
