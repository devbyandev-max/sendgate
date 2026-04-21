<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'bank.name' => 'BDO Unibank',
            'bank.account_name' => 'SendGate Philippines, Inc.',
            'bank.account_number' => '0012-3456-7890',
            'bank.instructions' => 'Please use your invoice number as reference when transferring.',
            'mail.from_address' => 'billing@sendgate.ph',
            'mail.from_name' => 'SendGate',
            'support.email' => 'support@sendgate.ph',
            'invoice.prefix' => 'SG',
            'timezone' => 'Asia/Manila',
            'pricing.standard_php' => 1499,
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }
    }
}
