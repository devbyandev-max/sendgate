<?php

namespace App\Providers;

use App\Services\Gateway\GatewayInterface;
use App\Services\Gateway\StubGateway;
use App\Services\Gateway\YxGpGateway;
use Illuminate\Support\ServiceProvider;

class GatewayServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(GatewayInterface::class, function ($app) {
            $driver = config('gateway.driver', 'stub');

            return match ($driver) {
                'yxgp' => new YxGpGateway(
                    host: (string) config('gateway.yxgp.host'),
                    username: (string) config('gateway.yxgp.username'),
                    password: (string) config('gateway.yxgp.password'),
                    charset: (string) config('gateway.yxgp.charset', 'utf8'),
                    timeoutSeconds: (int) config('gateway.yxgp.timeout_seconds', 10),
                    verifyTls: (bool) config('gateway.yxgp.verify_tls', true),
                ),
                default => new StubGateway,
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
