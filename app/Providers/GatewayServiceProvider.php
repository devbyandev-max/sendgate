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
