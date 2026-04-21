<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::with('user:id,name,email')->latest()->paginate(50);

        return Inertia::render('admin/invoices/index', ['invoices' => $invoices]);
    }
}
