<?php

namespace Database\Factories;

use App\Enums\ApiKeyStatus;
use App\Models\ApiKey;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ApiKey>
 */
class ApiKeyFactory extends Factory
{
    public function definition(): array
    {
        $prefix = 'sg_live_'.Str::random(8);
        $plaintext = $prefix.'_'.Str::random(32);

        return [
            'user_id' => User::factory(),
            'name' => fake()->words(2, true),
            'key_prefix' => $prefix,
            'key_hash' => hash('sha256', $plaintext),
            'last_used_at' => null,
            'expires_at' => null,
            'scopes' => null,
            'status' => ApiKeyStatus::Active,
        ];
    }

    public function revoked(): static
    {
        return $this->state(fn () => ['status' => ApiKeyStatus::Revoked]);
    }
}
