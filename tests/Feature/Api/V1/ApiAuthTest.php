<?php

use App\Enums\ApiKeyStatus;
use App\Models\ApiKey;
use App\Models\User;

test('unauthenticated requests return 401', function () {
    $this->getJson('/api/v1/account')
        ->assertStatus(401)
        ->assertJsonPath('error.code', 'unauthorized');
});

test('invalid api keys return 401', function () {
    $this->withHeader('Authorization', 'Bearer sg_live_invalid_xxx')
        ->getJson('/api/v1/account')
        ->assertStatus(401);
});

test('valid api key returns account', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $key = ApiKey::generate($user, 'Test');

    $this->withHeader('Authorization', 'Bearer '.$key->plaintext)
        ->getJson('/api/v1/account')
        ->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

test('revoked api keys are rejected', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $key = ApiKey::generate($user, 'Test');
    $key->update(['status' => ApiKeyStatus::Revoked]);

    $this->withHeader('Authorization', 'Bearer '.$key->plaintext)
        ->getJson('/api/v1/account')
        ->assertStatus(401);
});
