<?php

namespace App\Console\Commands\Gateway;

use App\Enums\SimCarrier;
use App\Enums\SimStatus;
use App\Enums\UserStatus;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;
use App\Services\Gateway\GatewayInterface;
use App\Services\Gateway\YxGpGateway;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Throwable;

#[Signature('gateway:test-sms
    {to=09051396541 : Destination phone number}
    {--port=1 : Hardware port the SIM lives on}
    {--from=09000000001 : "From" phone number recorded on the SmsMessage row}
    {--message=Hello from SendGate gateway test : SMS body}')]
#[Description('Send one SMS through the configured gateway driver (default: YX GP) for end-to-end verification.')]
class SendTestSms extends Command
{
    public function handle(GatewayInterface $gateway): int
    {
        $driver = (string) config('gateway.driver');
        $this->line('Driver: '.$driver.' ('.$gateway::class.')');

        if ($gateway instanceof YxGpGateway) {
            $this->line('Target: '.config('gateway.yxgp.host').'  user='.config('gateway.yxgp.username'));
        }

        $port = (int) $this->option('port');
        $from = (string) $this->option('from');
        $to = (string) $this->argument('to');
        $message = (string) $this->option('message');

        $user = User::firstOrCreate(
            ['email' => 'gateway-test@sendgate.local'],
            [
                'name' => 'Gateway Test',
                'password' => Hash::make(bin2hex(random_bytes(16))),
                'status' => UserStatus::Active,
                'email_verified_at' => now(),
            ],
        );

        $sim = Sim::firstOrCreate(
            ['port_number' => $port],
            [
                'user_id' => $user->id,
                'iccid' => 'TEST-PORT-'.$port,
                'phone_number' => $from,
                'carrier' => SimCarrier::Other,
                'status' => SimStatus::Active,
                'label' => 'Gateway test SIM (port '.$port.')',
                'activated_at' => now(),
            ],
        );

        $this->line('SIM:    id='.$sim->id.'  port='.$sim->port_number.'  phone='.$sim->phone_number);
        $this->line('To:     '.$to);
        $this->line('Body:   '.$message);
        $this->newLine();

        try {
            $response = $gateway->sendSms($sim, $to, $message);
        } catch (Throwable $e) {
            $this->error('Driver threw: '.$e::class.' — '.$e->getMessage());

            return self::FAILURE;
        }

        $this->line('--- GatewayResponse ---');
        $this->line('success:            '.($response->success ? 'true' : 'false'));
        $this->line('providerMessageId:  '.($response->providerMessageId ?? 'null'));
        $this->line('status:             '.($response->status ?? 'null'));
        $this->line('segments:           '.($response->segments ?? 'null'));
        $this->line('errorMessage:       '.($response->errorMessage ?? 'null'));

        $sms = SmsMessage::where('provider_message_id', $response->providerMessageId)->latest()->first();
        if ($sms) {
            $this->newLine();
            $this->line('--- SmsMessage row #'.$sms->id.' ---');
            $this->line('status:        '.$sms->status?->value);
            $this->line('error_message: '.($sms->error_message ?? 'null'));
            $this->line('sent_at:       '.$sms->sent_at);
        }

        return $response->success ? self::SUCCESS : self::FAILURE;
    }
}
