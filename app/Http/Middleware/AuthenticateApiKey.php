<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiKey
{
    /**
     * Handle an incoming request. Validates the
     * `Authorization: Bearer sg_live_...` header against the api_keys table.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bearer = $request->bearerToken();

        if (! $bearer) {
            return $this->unauthorized('Missing API key.');
        }

        $apiKey = ApiKey::findByPlaintext($bearer);

        if (! $apiKey) {
            return $this->unauthorized('Invalid or revoked API key.');
        }

        if ($apiKey->expires_at && $apiKey->expires_at->isPast()) {
            return $this->unauthorized('API key has expired.');
        }

        $apiKey->forceFill(['last_used_at' => now()])->saveQuietly();

        $request->setUserResolver(fn () => $apiKey->user);
        $request->attributes->set('api_key', $apiKey);

        return $next($request);
    }

    protected function unauthorized(string $message): Response
    {
        return response()->json([
            'error' => [
                'code' => 'unauthorized',
                'message' => $message,
            ],
        ], 401);
    }
}
