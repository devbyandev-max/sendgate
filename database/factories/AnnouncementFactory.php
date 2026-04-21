<?php

namespace Database\Factories;

use App\Enums\AnnouncementAudience;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'admin_id' => User::factory(),
            'title' => fake()->sentence(4),
            'body' => fake()->paragraphs(2, true),
            'audience' => AnnouncementAudience::All,
            'published_at' => now(),
        ];
    }
}
