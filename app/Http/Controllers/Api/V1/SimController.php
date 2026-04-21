<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Sim;
use App\Services\Gateway\GatewayInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SimController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()->sims()->get()]);
    }

    public function show(Request $request, Sim $sim): JsonResponse
    {
        if ($sim->user_id !== $request->user()->id) {
            return response()->json(['error' => ['code' => 'not_found', 'message' => 'SIM not found.']], 404);
        }

        return response()->json(['data' => $sim]);
    }

    public function balance(Request $request, Sim $sim, GatewayInterface $gateway): JsonResponse
    {
        if ($sim->user_id !== $request->user()->id) {
            return response()->json(['error' => ['code' => 'not_found', 'message' => 'SIM not found.']], 404);
        }

        $status = $gateway->getSimStatus($sim);

        return response()->json([
            'data' => [
                'sim_id' => $sim->id,
                'online' => $status->online,
                'signal_strength' => $status->signalStrength,
                'balance' => $status->balance,
                'carrier' => $status->carrier,
            ],
        ]);
    }
}
