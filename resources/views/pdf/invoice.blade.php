<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #18181b; font-size: 12px; }
        .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: bold; color: #10b981; }
        .meta { float: right; text-align: right; font-size: 11px; }
        h2 { font-size: 16px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e4e4e7; }
        th { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; }
        .total { font-size: 18px; font-weight: bold; text-align: right; padding-top: 16px; }
        .muted { color: #71717a; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="meta">
            <strong>Invoice {{ $invoice->invoice_number }}</strong><br>
            Issued: {{ $invoice->created_at->format('M j, Y') }}<br>
            Due: {{ \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y') }}
        </div>
        <div class="brand">SendGate</div>
        <p class="muted">SendGate Philippines, Inc.</p>
    </div>

    <h2>Bill to</h2>
    <p>
        {{ $invoice->user->name }}<br>
        @if($invoice->user->company_name){{ $invoice->user->company_name }}<br>@endif
        {{ $invoice->user->email }}
    </p>

    <h2>Charges</h2>
    <table>
        <thead>
            <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
        </thead>
        <tbody>
            <tr>
                <td>SendGate Standard — monthly SIM subscription</td>
                <td style="text-align:right">₱{{ number_format($invoice->amount_php, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <p class="total">Total: ₱{{ number_format($invoice->amount_php, 2) }}</p>

    <h2>Payment instructions</h2>
    <p class="muted">
        Please transfer the total to the bank details available in your billing dashboard, using the invoice number as
        the reference. Then upload your payment proof at:
        <strong>https://sendgate.ph/app/billing/invoices/{{ $invoice->id }}</strong>.
    </p>

    <p class="muted" style="margin-top:32px">Thanks for being a SendGate customer.</p>
</body>
</html>
