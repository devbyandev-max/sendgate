<?php

namespace Database\Seeders;

use App\Enums\InvoiceStatus;
use App\Enums\MessageDirection;
use App\Enums\MessageStatus;
use App\Enums\SimCarrier;
use App\Enums\SimStatus;
use App\Enums\SubscriptionStatus;
use App\Enums\UserStatus;
use App\Models\ApiKey;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Invoice;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoCustomerSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPrimaryDemo();
        $this->seedSecondaryDemo();
    }

    private function seedPrimaryDemo(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo Customer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'company_name' => 'Acme Corp PH',
                'status' => UserStatus::Active,
            ],
        );

        if (! $user->hasRole('customer')) {
            $user->assignRole('customer');
        }

        // SIM
        $sim = Sim::updateOrCreate(
            ['phone_number' => '+639171234567'],
            [
                'user_id' => $user->id,
                'iccid' => '89630'.str_pad((string) $user->id, 15, '0', STR_PAD_LEFT),
                'carrier' => SimCarrier::Globe,
                'port_number' => 1,
                'label' => 'Production line 1',
                'status' => SimStatus::Active,
                'activated_at' => now()->subDays(60),
            ],
        );

        // Subscription
        $subscription = Subscription::updateOrCreate(
            ['sim_id' => $sim->id],
            [
                'user_id' => $user->id,
                'plan_name' => 'SendGate Standard',
                'price_php' => 1499.00,
                'billing_cycle' => 'monthly',
                'starts_at' => now()->subDays(60),
                'next_billing_at' => now()->addDay(),
                'status' => SubscriptionStatus::Active,
            ],
        );

        // Paid invoice (previous month)
        Invoice::updateOrCreate(
            ['invoice_number' => 'SG-'.now()->subMonth()->format('Ym').'-0001'],
            [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'amount_php' => 1499.00,
                'status' => InvoiceStatus::Paid,
                'due_date' => now()->subDays(23),
                'paid_at' => now()->subDays(20),
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'SEED-PAID-001',
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(20),
            ],
        );

        // Pending invoice (current month)
        Invoice::updateOrCreate(
            ['invoice_number' => 'SG-'.now()->format('Ym').'-0001'],
            [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'amount_php' => 1499.00,
                'status' => InvoiceStatus::Pending,
                'due_date' => now()->addDays(7),
                'payment_method' => 'bank_transfer',
            ],
        );

        // 50 SMS messages spread across last 30 days.
        if ($user->smsMessages()->count() === 0) {
            $total = 50;
            $delivered = (int) round($total * 0.90); // 45
            $failed = (int) round($total * 0.05);    // 2-3
            $inbound = $total - $delivered - $failed;

            SmsMessage::factory()
                ->count($delivered)
                ->for($user)
                ->for($sim)
                ->state(fn () => [
                    'from_number' => $sim->phone_number,
                    'direction' => MessageDirection::Outbound,
                    'status' => MessageStatus::Delivered,
                ])
                ->create();

            SmsMessage::factory()
                ->count($failed)
                ->for($user)
                ->for($sim)
                ->failed()
                ->state(fn () => ['from_number' => $sim->phone_number])
                ->create();

            SmsMessage::factory()
                ->count($inbound)
                ->for($user)
                ->for($sim)
                ->inbound()
                ->state(fn () => ['to_number' => $sim->phone_number])
                ->create();
        }

        // Contacts + group
        if ($user->contacts()->count() === 0) {
            $contacts = Contact::factory()->count(3)->for($user)->create();

            $group = ContactGroup::updateOrCreate(
                ['user_id' => $user->id, 'name' => 'VIP Customers'],
                ['color' => '#3b82f6'],
            );

            $group->contacts()->syncWithoutDetaching($contacts->take(2)->pluck('id')->all());
        }

        // API Key
        if ($user->apiKeys()->count() === 0) {
            ApiKey::generate($user, 'Production');
        }
    }

    private function seedSecondaryDemo(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'demo2@example.com'],
            [
                'name' => 'Demo Customer Two',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'status' => UserStatus::Active,
            ],
        );

        if (! $user->hasRole('customer')) {
            $user->assignRole('customer');
        }
    }
}
