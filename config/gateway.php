<?php

return [

    /*
    |--------------------------------------------------------------------------
    | SMS Gateway Driver
    |--------------------------------------------------------------------------
    |
    | Controls which gateway implementation is used. Use "stub" during local
    | development and for the initial MVP; swap to "yxgp" once the hardware
    | endpoint is wired up in App\Services\Gateway\YxGpGateway.
    |
    | Supported: "stub", "yxgp"
    */

    'driver' => env('GATEWAY_DRIVER', 'stub'),

    /*
    |--------------------------------------------------------------------------
    | YX GP Gateway (YX International YX-Series GP)
    |--------------------------------------------------------------------------
    |
    | HTTP API base values for a YX GP hardware gateway. See
    | `app/Services/Gateway/YxGpGateway.php` and the vendor manual
    | (section 11 — HTTP API).
    |
    | `host` may include a port (e.g. "192.168.1.100:8080"). Default port 80.
    | `charset` must be one of utf8, gb2312.
    */

    'yxgp' => [
        'host' => env('YXGP_HOST'),
        'username' => env('YXGP_USERNAME'),
        'password' => env('YXGP_PASSWORD'),
        'charset' => env('YXGP_CHARSET', 'utf8'),
        'timeout_seconds' => (int) env('YXGP_TIMEOUT', 10),
        'verify_tls' => (bool) env('YXGP_VERIFY_TLS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Inbound callback authentication
    |--------------------------------------------------------------------------
    |
    | Shared token the hardware gateway sends in a URL query param (`token=…`)
    | on every callback it makes to us. We compare this value in constant time
    | inside `VerifyGatewayCallback` middleware. Rotate by changing both sides.
    */

    'callback' => [
        'token' => env('GATEWAY_CALLBACK_TOKEN'),
    ],

];
