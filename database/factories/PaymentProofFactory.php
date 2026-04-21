<?php

namespace Database\Factories;

use App\Enums\PaymentProofStatus;
use App\Models\Invoice;
use App\Models\PaymentProof;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PaymentProof>
 */
class PaymentProofFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'user_id' => User::factory(),
            'file_path' => 'payment-proofs/sample-'.Str::random(8).'.jpg',
            'amount_claimed' => 1499.00,
            'reference_number' => fake()->optional()->bothify('REF-########'),
            'bank_name' => fake()->optional()->randomElement(['BDO', 'BPI', 'Metrobank', 'UnionBank']),
            'uploaded_at' => now(),
            'reviewed_by' => null,
            'reviewed_at' => null,
            'status' => PaymentProofStatus::Pending,
            'admin_notes' => null,
        ];
    }
}
