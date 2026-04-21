<?php

use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\User;

test('a customer can send a single SMS through the stub gateway', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create([
        'user_id' => $user->id,
        'status' => SimStatus::Active,
        'phone_number' => '+639171234567',
    ]);

    $this->actingAs($user)
        ->post('/app/sms/send', [
            'sim_id' => $sim->id,
            'to' => '+639998877665',
            'message' => 'Test message',
        ])
        ->assertRedirect('/app/sms/outbox');

    $this->assertDatabaseHas('sms_messages', [
        'sim_id' => $sim->id,
        'to_number' => '+639998877665',
        'message' => 'Test message',
    ]);
});

test('phone number must be a valid PH mobile', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active]);

    $this->actingAs($user)
        ->post('/app/sms/send', [
            'sim_id' => $sim->id,
            'to' => '12345',
            'message' => 'Test',
        ])
        ->assertSessionHasErrors('to');
});
