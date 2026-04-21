<?php

namespace Database\Factories;

use App\Enums\SubscriptionStatus;
use App\Models\Sim;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        $startsAt = now()->subDays(30);

        return [
            'user_id' => User::factory(),
            'sim_id' => Sim::factory(),
            'plan_name' => 'SendGate Standard',
            'price_php' => 1499.00,
            'billing_cycle' => 'monthly',
            'starts_at' => $startsAt,
            'ends_at' => null,
            'next_billing_at' => $startsAt->copy()->addMonth(),
            'status' => SubscriptionStatus::Active,
            'cancelled_at' => null,
        ];
    }
}
