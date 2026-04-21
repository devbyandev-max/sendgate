<?php

namespace Database\Factories;

use App\Enums\CampaignStatus;
use App\Models\Sim;
use App\Models\SmsCampaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SmsCampaign>
 */
class SmsCampaignFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'sim_id' => Sim::factory(),
            'name' => fake()->words(3, true),
            'message_template' => 'Hello {name}, '.fake()->sentence(),
            'total_recipients' => 0,
            'sent_count' => 0,
            'delivered_count' => 0,
            'failed_count' => 0,
            'status' => CampaignStatus::Draft,
            'scheduled_at' => null,
            'started_at' => null,
            'completed_at' => null,
        ];
    }
}
