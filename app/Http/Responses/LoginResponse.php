<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Redirect admins to the admin dashboard and customers to /app/dashboard.
     */
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        /** @var Request $request */
        $user = $request->user();

        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        if ($user && $user->hasAnyRole(['admin', 'super_admin'])) {
            return redirect()->intended('/admin/dashboard');
        }

        return redirect()->intended('/app/dashboard');
    }
}
