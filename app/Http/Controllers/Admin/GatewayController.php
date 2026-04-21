<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin view of the hardware gateway integration — driver state, callback URLs,
 * and a one-click health check that pings the device.
 */
class GatewayController extends Controller
{
    public function index(Request $request): Response
    {
        $driver = (string) config('gateway.driver', 'stub');
        $yxgp = config('gateway.yxgp');
        $callback = config('gateway.callback');

        // Build the URLs the user has to paste into the YX GP admin UI.
        $token = (string) ($callback['token'] ?? '');
        $callbackUrls = [
            'sms' => $token ? URL::route('gateway.callback.sms', ['token' => $token]) : null,
            'dlr' => $token ? URL::route('gateway.callback.dlr', ['token' => $token]) : null,
        ];

        return Inertia::render('admin/gateway/index', [
            'driver' => $driver,
            'yxgp' => [
                'host' => $yxgp['host'] ?? null,
                'username' => $yxgp['username'] ?? null,
                'charset' => $yxgp['charset'] ?? 'utf8',
                // Never send the password to the browser; just report whether it's set.
                'password_set' => ! empty($yxgp['password']),
            ],
            'callback' => [
                'token_set' => $token !== '',
                'urls' => $callbackUrls,
            ],
        ]);
    }

    /**
     * Ping the YX GP and report connectivity.
     */
    public function health(): JsonResponse
    {
        if (config('gateway.driver') !== 'yxgp') {
            return response()->json([
                'ok' => false,
                'message' => 'Gateway driver is "'.config('gateway.driver').'". Set GATEWAY_DRIVER=yxgp in your .env to talk to real hardware.',
            ]);
        }

        $host = (string) config('gateway.yxgp.host');
        $username = (string) config('gateway.yxgp.username');
        $password = (string) config('gateway.yxgp.password');

        if ($host === '' || $username === '' || $password === '') {
            return response()->json([
                'ok' => false,
                'message' => 'YX GP host/username/password are not fully configured.',
            ]);
        }

        $url = (str_starts_with($host, 'http') ? $host : 'http://'.$host);
        $url = rtrim($url, '/').'/GP_get_sms.html?'.http_build_query([
            'username' => $username,
            'password' => $password,
            'sms_num' => 1,
        ]);

        try {
            $start = microtime(true);
            $response = Http::timeout(5)
                ->withBasicAuth($username, $password)
                ->withOptions(['verify' => (bool) config('gateway.yxgp.verify_tls', true)])
                ->get($url);
            $ms = (int) round((microtime(true) - $start) * 1000);

            return response()->json([
                'ok' => $response->successful(),
                'status' => $response->status(),
                'latency_ms' => $ms,
                'body_preview' => mb_substr((string) $response->body(), 0, 200),
            ]);
        } catch (ConnectionException $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Cannot reach the gateway: '.$e->getMessage(),
            ]);
        } catch (RequestException $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Gateway returned an error: '.$e->getMessage(),
            ]);
        }
    }
}
