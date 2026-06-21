<?php

use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\User;

function adminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

function customerUser(): User
{
    $u = User::factory()->create();
    $u->assignRole('customer');

    return $u;
}

test('admin can add a SIM with a port assignment', function () {
    $admin = adminUser();
    $customer = customerUser();

    $this->actingAs($admin)->post('/admin/sims', [
        'iccid' => '8963012345678901234',
        'phone_number' => '+639171234567',
        'carrier' => 'globe',
        'port_number' => 1,
        'user_id' => $customer->id,
    ])->assertRedirect();

    $sim = Sim::where('iccid', '8963012345678901234')->firstOrFail();
    expect($sim->port_number)->toBe(1)
        ->and($sim->carrier->value)->toBe('globe')
        ->and($sim->user_id)->toBe($customer->id)
        ->and($sim->status)->toBe(SimStatus::Received);
});

test('admin can add an unassigned SIM (no customer)', function () {
    $admin = adminUser();

    $this->actingAs($admin)->post('/admin/sims', [
        'iccid' => 'TEST-UNASSIGNED-001',
        'phone_number' => '+639171110000',
        'carrier' => 'smart',
        'port_number' => 2,
        'user_id' => null,
    ])->assertRedirect();

    $sim = Sim::where('iccid', 'TEST-UNASSIGNED-001')->firstOrFail();
    expect($sim->user_id)->toBeNull()
        ->and($sim->port_number)->toBe(2);
});

test('admin add-SIM rejects duplicate ICCID', function () {
    $admin = adminUser();
    Sim::factory()->create(['iccid' => 'DUPLICATE-ICCID']);

    $this->actingAs($admin)->post('/admin/sims', [
        'iccid' => 'DUPLICATE-ICCID',
        'phone_number' => '+639170000000',
        'carrier' => 'globe',
    ])->assertSessionHasErrors('iccid');
});

test('admin can assign a SIM to a customer', function () {
    $admin = adminUser();
    $customer = customerUser();
    $sim = Sim::factory()->create(['user_id' => null]);

    $this->actingAs($admin)->post("/admin/sims/{$sim->id}/assign", [
        'user_id' => $customer->id,
    ])->assertRedirect();

    expect($sim->fresh()->user_id)->toBe($customer->id);
});

test('admin can activate a SIM', function () {
    $admin = adminUser();
    $sim = Sim::factory()->create(['status' => SimStatus::Received, 'activated_at' => null]);

    $this->actingAs($admin)->post("/admin/sims/{$sim->id}/activate")->assertRedirect();

    $fresh = $sim->fresh();
    expect($fresh->status)->toBe(SimStatus::Active)
        ->and($fresh->activated_at)->not->toBeNull();
});

test('customers cannot manage SIMs', function () {
    $customer = customerUser();

    $this->actingAs($customer)->post('/admin/sims', [
        'iccid' => 'BLOCKED',
        'phone_number' => '+639170000001',
        'carrier' => 'globe',
    ])->assertStatus(403);
});
