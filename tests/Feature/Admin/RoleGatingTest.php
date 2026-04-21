<?php

use App\Models\User;

test('customers cannot access admin routes', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');

    $this->actingAs($user)
        ->get('/admin/dashboard')
        ->assertStatus(403);
});

test('admins can access admin dashboard', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/admin/dashboard')
        ->assertOk();
});

test('guests are redirected to login from app routes', function () {
    $this->get('/app/dashboard')->assertRedirect('/login');
});

test('admins can reach the gateway admin page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)->get('/admin/gateway')->assertOk();
});
