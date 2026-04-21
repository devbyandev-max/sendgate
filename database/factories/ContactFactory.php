<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contact>
 */
class ContactFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'phone_number' => '+639'.fake()->unique()->numerify('#########'),
            'email' => fake()->optional()->safeEmail(),
            'tags' => fake()->optional()->randomElements(['vip', 'lead', 'customer', 'prospect'], 2),
            'custom_fields' => null,
        ];
    }
}
