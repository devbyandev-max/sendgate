<?php

namespace App\Services\Gateway;

use App\Models\Sim;
use App\Services\Gateway\DTOs\GatewayResponse;
use App\Services\Gateway\DTOs\SimStatus;
use App\Services\Gateway\Exceptions\GatewayException;

/**
 * Production driver for the YX GP hardware SMS gateway.
 *
 * TODO: implement against the YX GP HTTP API. See `config/gateway.php` for
 * credentials and host configuration.
 */
class YxGpGateway implements GatewayInterface
{
    public function __construct(
        protected string $host,
        protected string $username,
        protected string $password,
    ) {}

    public function sendSms(Sim $sim, string $to, string $message): GatewayResponse
    {
        throw new GatewayException('YX GP gateway driver is not implemented yet. Configure the driver in app/Services/Gateway/YxGpGateway.php.');
    }

    public function getSimStatus(Sim $sim): SimStatus
    {
        throw new GatewayException('YX GP gateway driver is not implemented yet.');
    }

    public function pollIncomingMessages(Sim $sim): array
    {
        throw new GatewayException('YX GP gateway driver is not implemented yet.');
    }
}
