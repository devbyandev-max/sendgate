<?php

namespace App\Http\Controllers\App;

use App\Enums\PaymentProofStatus;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PaymentProof;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentProofController extends Controller
{
    public function store(Request $request, Invoice $invoice): RedirectResponse
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            'amount_claimed' => ['required', 'numeric', 'min:0.01'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
        ]);

        $path = $request->file('file')->store('payment-proofs', 'public');

        PaymentProof::create([
            'invoice_id' => $invoice->id,
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'amount_claimed' => $data['amount_claimed'],
            'reference_number' => $data['reference_number'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'uploaded_at' => now(),
            'status' => PaymentProofStatus::Pending,
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Payment proof submitted. We will review it within 1 business day.',
        ]);
    }
}
