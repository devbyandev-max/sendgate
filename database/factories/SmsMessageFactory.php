<?php

namespace Database\Factories;

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SmsMessage>
 */
class SmsMessageFactory extends Factory
{
    public function definition(): array
    {
        $sentAt = now()->subMinutes(fake()->numberBetween(1, 60 * 24 * 30));
        $from = '+639'.fake()->numerify('#########');
        $to = '+639'.fake()->numerify('#########');

        return [
            'user_id' => User::factory(),
            'sim_id' => Sim::factory(),
            'direction' => MessageDirection::Outbound,
            'from_number' => $from,
            'to_number' => $to,
            'message' => fake()->sentence(),
            'segments' => 1,
            'status' => MessageStatus::Delivered,
            'provider_message_id' => null,
            'error_message' => null,
            'sent_at' => $sentAt,
            'delivered_at' => (clone $sentAt)->addSeconds(fake()->numberBetween(2, 30)),
        ];
    }

    public function inbound(): static
    {
        return $this->state(fn () => [
            'direction' => MessageDirection::Inbound,
            'status' => MessageStatus::Received,
            'delivered_at' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => MessageStatus::Failed,
            'error_message' => 'Delivery failed',
            'delivered_at' => null,
        ]);
    }

    public function queued(): static
    {
        return $this->state(fn () => [
            'status' => MessageStatus::Queued,
            'sent_at' => null,
            'delivered_at' => null,
        ]);
    }
}
