<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('app/billing/index', [
            'subscription' => $user->subscriptions()->with('sim')->first(),
            'invoices' => $user->invoices()->latest()->get(),
            'bank' => [
                'name' => Setting::get('bank.name'),
                'account_name' => Setting::get('bank.account_name'),
                'account_number' => Setting::get('bank.account_number'),
                'instructions' => Setting::get('bank.instructions'),
            ],
        ]);
    }

    public function show(Request $request, Invoice $invoice): Response
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);

        return Inertia::render('app/billing/show', [
            'invoice' => $invoice->load('paymentProofs'),
            'bank' => [
                'name' => Setting::get('bank.name'),
                'account_name' => Setting::get('bank.account_name'),
                'account_number' => Setting::get('bank.account_number'),
                'instructions' => Setting::get('bank.instructions'),
            ],
        ]);
    }

    public function downloadPdf(Request $request, Invoice $invoice): HttpResponse
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);

        $html = view('pdf.invoice', ['invoice' => $invoice])->render();
        $pdf = app('dompdf.wrapper')->loadHTML($html);

        return $pdf->download('invoice-'.$invoice->invoice_number.'.pdf');
    }
}
