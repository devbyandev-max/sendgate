<?php

namespace App\Jobs;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendOverdueRemindersJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Invoice::query()
            ->where('status', InvoiceStatus::Pending)
            ->where('due_date', '<', now()->toDateString())
            ->get()
            ->each(function (Invoice $invoice) {
                $invoice->update(['status' => InvoiceStatus::Overdue]);
                // TODO: send InvoiceOverdueReminderNotification in Phase 8.
            });
    }
}
