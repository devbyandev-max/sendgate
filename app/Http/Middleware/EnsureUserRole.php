<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request. Roles are OR-matched; pass multiple roles
     * separated by '|', e.g. `role:admin|super_admin`.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $allowed = explode('|', $roles);

        if (! $user->hasAnyRole($allowed)) {
            abort(403, 'You do not have access to this area.');
        }

        return $next($request);
    }
}
