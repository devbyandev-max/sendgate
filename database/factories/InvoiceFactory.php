<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'subscription_id' => null,
            'invoice_number' => Invoice::generateNumber(),
            'amount_php' => 1499.00,
            'status' => InvoiceStatus::Pending,
            'due_date' => now()->addDays(7),
            'paid_at' => null,
            'payment_method' => 'bank_transfer',
            'payment_reference' => null,
            'notes' => null,
            'pdf_path' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Paid,
            'paid_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Overdue,
            'due_date' => now()->subDays(10),
        ]);
    }
}
