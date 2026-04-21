<?php

namespace Database\Factories;

use App\Enums\SimCarrier;
use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sim>
 */
class SimFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'iccid' => '89630'.fake()->unique()->numerify('###############'),
            'phone_number' => '+639'.fake()->unique()->numerify('#########'),
            'carrier' => fake()->randomElement(SimCarrier::cases()),
            'port_number' => fake()->numberBetween(1, 8),
            'label' => fake()->optional()->words(2, true),
            'status' => SimStatus::Active,
            'activated_at' => fake()->dateTimeBetween('-90 days', '-1 day'),
            'notes' => null,
        ];
    }

    public function pendingShipment(): static
    {
        return $this->state(fn () => [
            'status' => SimStatus::PendingShipment,
            'activated_at' => null,
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn () => ['status' => SimStatus::Suspended]);
    }
}
