<?php

use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;

test('conversations index lists threads grouped by (sim, remote)', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active]);

    // 3 messages to the same number (one thread) + 1 to a different number (another thread)
    SmsMessage::factory()->count(3)->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'to_number' => '+639171234567',
        'from_number' => $sim->phone_number,
    ]);
    SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'to_number' => '+639998887777',
        'from_number' => $sim->phone_number,
    ]);

    $this->actingAs($user)
        ->get('/app/conversations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('app/conversations/index')
            ->has('conversations', 2)
        );
});

test('opening a thread loads its messages in chronological order', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active]);

    SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Outbound,
        'to_number' => '+639171234567',
        'from_number' => $sim->phone_number,
        'message' => 'First',
        'created_at' => now()->subHour(),
    ]);
    SmsMessage::factory()->create([
        'user_id' => $user->id,
        'sim_id' => $sim->id,
        'direction' => MessageDirection::Inbound,
        'from_number' => '+639171234567',
        'to_number' => $sim->phone_number,
        'message' => 'Second',
        'status' => MessageStatus::Received,
        'created_at' => now()->subMinutes(30),
    ]);

    $thread = "{$sim->id}:+639171234567";

    $this->actingAs($user)
        ->get('/app/conversations?thread='.urlencode($thread))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('app/conversations/index')
            ->where('active_thread', $thread)
            ->has('messages', 2)
            ->where('messages.0.message', 'First')
            ->where('messages.1.message', 'Second')
        );
});

test('sending from the composer creates an sms and redirects to the thread', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create([
        'user_id' => $user->id,
        'status' => SimStatus::Active,
        'phone_number' => '+639171234567',
    ]);

    $this->actingAs($user)
        ->post('/app/conversations', [
            'sim_id' => $sim->id,
            'to' => '+639998887777',
            'message' => 'Hi!',
        ])
        ->assertRedirect('/app/conversations?thread='.urlencode("{$sim->id}:+639998887777"));

    $this->assertDatabaseHas('sms_messages', [
        'sim_id' => $sim->id,
        'to_number' => '+639998887777',
        'message' => 'Hi!',
    ]);
});

test('conversations are scoped per user', function () {
    $alice = User::factory()->create();
    $alice->assignRole('customer');
    $alicesSim = Sim::factory()->create(['user_id' => $alice->id, 'status' => SimStatus::Active]);
    SmsMessage::factory()->create([
        'user_id' => $alice->id,
        'sim_id' => $alicesSim->id,
        'to_number' => '+639111111111',
    ]);

    $bob = User::factory()->create();
    $bob->assignRole('customer');

    $this->actingAs($bob)
        ->get('/app/conversations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('conversations', 0));
});
