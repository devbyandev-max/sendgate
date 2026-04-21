<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentProofStatus;
use App\Http\Controllers\Controller;
use App\Models\PaymentProof;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentProofController extends Controller
{
    public function index(Request $request): Response
    {
        $proofs = PaymentProof::with(['user:id,name,email,company_name', 'invoice:id,invoice_number,amount_php'])
            ->latest('uploaded_at')
            ->paginate(25);

        return Inertia::render('admin/payments/index', ['proofs' => $proofs]);
    }

    public function approve(Request $request, PaymentProof $proof): RedirectResponse
    {
        $proof->update([
            'status' => PaymentProofStatus::Approved,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $proof->invoice->update([
            'status' => InvoiceStatus::Paid,
            'paid_at' => now(),
            'payment_reference' => $proof->reference_number,
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Payment approved.']);
    }

    public function reject(Request $request, PaymentProof $proof): RedirectResponse
    {
        $data = $request->validate(['admin_notes' => ['required', 'string', 'max:1000']]);

        $proof->update([
            'status' => PaymentProofStatus::Rejected,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $data['admin_notes'],
        ]);

        return back()->with('toast', ['type' => 'info', 'message' => 'Payment rejected and customer notified.']);
    }
}
