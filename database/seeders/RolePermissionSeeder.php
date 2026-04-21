<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions before seeding.
        Artisan::call('permission:cache-reset');

        $permissions = [
            'view sims' => ['customer', 'admin', 'super_admin'],
            'manage sims' => ['admin', 'super_admin'],
            'view customers' => ['admin', 'super_admin'],
            'manage customers' => ['admin', 'super_admin'],
            'view invoices' => ['customer', 'admin', 'super_admin'],
            'manage invoices' => ['admin', 'super_admin'],
            'review payments' => ['admin', 'super_admin'],
            'send messages' => ['customer'],
            'manage api keys' => ['customer'],
            'manage webhooks' => ['customer'],
            'manage announcements' => ['admin', 'super_admin'],
            'manage admins' => ['super_admin'],
            'view activity logs' => ['admin', 'super_admin'],
        ];

        // Ensure all roles exist.
        foreach (['customer', 'admin', 'super_admin'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // Create permissions and assign to roles.
        foreach ($permissions as $permissionName => $roleNames) {
            $permission = Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);

            foreach ($roleNames as $roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role && ! $role->hasPermissionTo($permission)) {
                    $role->givePermissionTo($permission);
                }
            }
        }

        // Super admin gets every permission.
        $superAdmin = Role::where('name', 'super_admin')->first();
        if ($superAdmin) {
            $superAdmin->syncPermissions(Permission::all());
        }
    }
}
