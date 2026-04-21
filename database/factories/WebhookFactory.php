<?php

namespace Database\Factories;

use App\Enums\WebhookStatus;
use App\Models\User;
use App\Models\Webhook;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Webhook>
 */
class WebhookFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'url' => fake()->url(),
            'events' => ['message.delivered', 'message.failed'],
            'secret' => Str::random(40),
            'status' => WebhookStatus::Active,
            'last_triggered_at' => null,
        ];
    }
}
