<?php

namespace Database\Factories;

use App\Models\Webhook;
use App\Models\WebhookDelivery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WebhookDelivery>
 */
class WebhookDeliveryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'webhook_id' => Webhook::factory(),
            'event' => 'message.delivered',
            'payload' => ['message_id' => fake()->uuid()],
            'response_code' => 200,
            'response_body' => 'OK',
            'attempted_at' => now(),
            'succeeded' => true,
        ];
    }
}
