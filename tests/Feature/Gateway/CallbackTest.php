<?php

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;

beforeEach(function () {
    config()->set('gateway.callback.token', 'super-secret');
});

test('inbound sms callback rejects missing or bad tokens', function () {
    $this->postJson('/gateway/callback/sms', [])
        ->assertStatus(401);

    $this->postJson('/gateway/callback/sms?token=wrong', [])
        ->assertStatus(401);
});

test('inbound sms callback creates an inbound message matched by port', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create([
        'user_id' => $user->id,
        'status' => SimStatus::Active,
        'port_number' => 8,
        'phone_number' => '+639171234567',
    ]);

    $this->postJson('/gateway/callback/sms?token=super-secret', [
        'sender' => '+639998887777',
        'receiver' => '+639171234567',
        'port' => 8,
        'content' => 'Hello from outside',
        'time' => '2026-04-21 12:00:00',
    ])->assertOk();

    $sms = SmsMessage::where('from_number', '+639998887777')->firstOrFail();
    expect($sms->direction)->toBe(MessageDirection::Inbound)
        ->and($sms->sim_id)->toBe($sim->id)
        ->and($sms->message)->toBe('Hello from outside')
        ->and($sms->status)->toBe(MessageStatus::Received);
});

test('inbound sms callback returns 404 when no SIM matches', function () {
    $this->postJson('/gateway/callback/sms?token=super-secret', [
        'sender' => '+639998887777',
        'port' => 99,
        'content' => 'Orphan',
    ])->assertStatus(404);
});

test('delivery report callback updates an existing outbound message', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $sms = SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'status' => MessageStatus::Queued,
        'provider_message_id' => 'yxgp:12345',
    ]);

    $this->postJson('/gateway/callback/dlr?token=super-secret', [
        'tid' => 12345,
        'status' => 'delivered',
        'time' => '2026-04-21 12:05:00',
    ])->assertOk();

    expect($sms->fresh()->status)->toBe(MessageStatus::Delivered);
});

test('delivery report callback with failed status updates error_message', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $sms = SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'status' => MessageStatus::Queued,
        'provider_message_id' => 'yxgp:77',
    ]);

    $this->postJson('/gateway/callback/dlr?token=super-secret', [
        'tid' => 77,
        'status' => 'fail',
        'reason' => 'no_signal',
    ])->assertOk();

    $fresh = $sms->fresh();
    expect($fresh->status)->toBe(MessageStatus::Failed)
        ->and($fresh->error_message)->toBe('no_signal');
});
