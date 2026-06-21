<?php

use App\Enums\MessageStatus;
use App\Enums\SimStatus;
use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;
use App\Services\Gateway\Exceptions\GatewayException;
use App\Services\Gateway\YxGpGateway;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config()->set('gateway.driver', 'yxgp');
    config()->set('gateway.yxgp.host', '192.0.2.10');
    config()->set('gateway.yxgp.username', 'root');
    config()->set('gateway.yxgp.password', 'root');
    config()->set('app.env', 'production'); // disable the dev-only simulated-delivery fallback
});

test('sendSms posts to /goip_post_sms.html with the documented JSON body', function () {
    Http::fake([
        '*/goip_post_sms.html*' => Http::response([
            'code' => 200,
            'reason' => 'OK',
            'type' => 'task-status',
            'status' => [['tid' => 98, 'status' => '0 OK']],
        ], 200),
    ]);

    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create([
        'user_id' => $user->id,
        'status' => SimStatus::Active,
        'port_number' => 16,
        'phone_number' => '+639171234567',
    ]);

    $gateway = new YxGpGateway('192.0.2.10', 'root', 'root');
    $resp = $gateway->sendSms($sim, '+639998887777', 'Test');

    expect($resp->success)->toBeTrue();

    $sms = SmsMessage::where('to_number', '+639998887777')->firstOrFail();
    expect($sms->status)->toBe(MessageStatus::Queued)
        ->and($sms->provider_message_id)->toStartWith('yxgp:');

    Http::assertSent(function ($request) {
        return str_contains($request->url(), '/goip_post_sms.html')
            && str_contains($request->url(), 'version=1.1')
            && str_contains($request->url(), 'username=root')
            && str_contains($request->url(), 'password=root')
            && $request->method() === 'POST'
            && $request['type'] === 'send-sms'
            && $request['task_num'] === 1
            && $request['tasks'][0]['to'] === '+639998887777'
            && $request['tasks'][0]['from'] === '16'
            && $request['tasks'][0]['sms'] === 'Test'
            && $request['tasks'][0]['dr'] === 1;
    });
});

test('sendSms marks the message failed when the device returns a non-200 code', function () {
    Http::fake([
        '*/goip_post_sms.html*' => Http::response([
            'code' => 404,
            'reason' => 'Tasks Not Found',
            'type' => 'task-status',
        ], 200),
    ]);

    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $gateway = new YxGpGateway('192.0.2.10', 'root', 'root');
    $resp = $gateway->sendSms($sim, '+639998887777', 'Test');

    expect($resp->success)->toBeFalse();

    $sms = SmsMessage::where('to_number', '+639998887777')->firstOrFail();
    expect($sms->status)->toBe(MessageStatus::Failed)
        ->and($sms->error_message)->toContain('Tasks Not Found');
});

test('sendSms marks the message failed when the gateway is unreachable', function () {
    Http::fake(function () {
        throw new ConnectionException('timeout');
    });

    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => 1]);

    $gateway = new YxGpGateway('192.0.2.10', 'root', 'root');
    $resp = $gateway->sendSms($sim, '+639998887777', 'Test');

    expect($resp->success)->toBeFalse();

    $sms = SmsMessage::where('to_number', '+639998887777')->firstOrFail();
    expect($sms->status)->toBe(MessageStatus::Failed);
});

test('sendSms requires the SIM to have a port_number', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $sim = Sim::factory()->create(['user_id' => $user->id, 'status' => SimStatus::Active, 'port_number' => null]);

    $gateway = new YxGpGateway('192.0.2.10', 'root', 'root');

    $this->expectException(GatewayException::class);
    $gateway->sendSms($sim, '+639998887777', 'Test');
});
