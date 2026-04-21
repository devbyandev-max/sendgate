<?php

namespace App\Jobs;

use App\Enums\InvoiceStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateInvoicesJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Subscription::query()
            ->where('status', SubscriptionStatus::Active)
            ->where('next_billing_at', '<=', now())
            ->get()
            ->each(function (Subscription $subscription) {
                Invoice::create([
                    'user_id' => $subscription->user_id,
                    'subscription_id' => $subscription->id,
                    'invoice_number' => Invoice::generateNumber(),
                    'amount_php' => $subscription->price_php,
                    'status' => InvoiceStatus::Pending,
                    'due_date' => now()->addDays(14)->toDateString(),
                ]);

                $subscription->update([
                    'next_billing_at' => $subscription->next_billing_at->addMonth(),
                ]);
            });
    }
}
