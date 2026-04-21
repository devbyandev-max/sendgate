<?php

namespace Database\Factories;

use App\Enums\ScheduledMessageStatus;
use App\Models\ScheduledMessage;
use App\Models\Sim;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ScheduledMessage>
 */
class ScheduledMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'sim_id' => Sim::factory(),
            'to_number' => '+639'.fake()->numerify('#########'),
            'message' => fake()->sentence(),
            'scheduled_at' => now()->addHours(fake()->numberBetween(1, 72)),
            'status' => ScheduledMessageStatus::Pending,
            'sent_at' => null,
            'sms_message_id' => null,
        ];
    }
}
