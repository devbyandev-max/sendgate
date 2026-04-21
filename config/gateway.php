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

    'yxgp' => [
        'host' => env('YXGP_HOST'),
        'username' => env('YXGP_USERNAME'),
        'password' => env('YXGP_PASSWORD'),
    ],

];
