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

test('inbound sms callback parses V2.4.0 recv-sms positional array with base64 content', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create([
        'user_id' => $user->id,
        'status' => SimStatus::Active,
        'port_number' => 1,
        'phone_number' => '+639171234567',
    ]);

    $content = 'Hi! Your code is 482910';
    $base64 = base64_encode($content);

    $this->postJson('/gateway/callback/sms?token=super-secret', [
        'type' => 'recv-sms',
        'sms_num' => 1,
        'sms' => [
            [0, '1.01', 1718800000, '+639998887777', '+639171234567', $base64],
        ],
    ])->assertOk();

    $sms = SmsMessage::where('from_number', '+639998887777')->firstOrFail();
    expect($sms->direction)->toBe(MessageDirection::Inbound)
        ->and($sms->sim_id)->toBe($sim->id)
        ->and($sms->message)->toBe($content)
        ->and($sms->status)->toBe(MessageStatus::Received);
});

test('status-report callback marks the message Sent when counter is positive', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $sms = SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'status' => MessageStatus::Queued,
        'provider_message_id' => 'yxgp:55501',
    ]);

    $this->postJson('/gateway/callback/dlr?token=super-secret', [
        'type' => 'status-report',
        'rpt_num' => 1,
        'rpts' => [[
            'tid' => 55501,
            'sending' => 0,
            'sent' => 1,
            'failed' => 0,
            'unsent' => 0,
            'sdr' => [[0, '+639998887777', '1.01', 1718800100]],
        ]],
    ])->assertOk();

    expect($sms->fresh()->status)->toBe(MessageStatus::Sent);
});

test('status-report callback marks the message Failed and stores carrier reason', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $sms = SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'status' => MessageStatus::Queued,
        'provider_message_id' => 'yxgp:55502',
    ]);

    $this->postJson('/gateway/callback/dlr?token=super-secret', [
        'type' => 'status-report',
        'rpt_num' => 1,
        'rpts' => [[
            'tid' => 55502,
            'sending' => 0,
            'sent' => 0,
            'failed' => 1,
            'unsent' => 0,
            'fdr' => [[0, '+639998887777', '1.01', 1718800200, '21 No Network', '500 Carrier rejected']],
        ]],
    ])->assertOk();

    $fresh = $sms->fresh();
    expect($fresh->status)->toBe(MessageStatus::Failed)
        ->and($fresh->error_message)->toContain('No Network')
        ->and($fresh->error_message)->toContain('Carrier rejected');
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
