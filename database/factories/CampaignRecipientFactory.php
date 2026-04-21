<?php

namespace Database\Factories;

use App\Enums\CampaignRecipientStatus;
use App\Models\CampaignRecipient;
use App\Models\SmsCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CampaignRecipient>
 */
class CampaignRecipientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'campaign_id' => SmsCampaign::factory(),
            'phone_number' => '+639'.fake()->numerify('#########'),
            'variables' => ['name' => fake()->firstName()],
            'status' => CampaignRecipientStatus::Pending,
            'sent_at' => null,
            'error_message' => null,
        ];
    }
}
