<?php

namespace App\Services\Gateway;

use App\Models\Sim;
use App\Services\Gateway\DTOs\GatewayResponse;
use App\Services\Gateway\DTOs\IncomingMessage;
use App\Services\Gateway\DTOs\SimStatus;

interface GatewayInterface
{
    public function sendSms(Sim $sim, string $to, string $message): GatewayResponse;

    public function getSimStatus(Sim $sim): SimStatus;

    /**
     * @return array<int, IncomingMessage>
     */
    public function pollIncomingMessages(Sim $sim): array;
}
