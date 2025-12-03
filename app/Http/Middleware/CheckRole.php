<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'No autenticado. Por favor inicia sesión.',
            ], 401);
        }

        $user = $request->user();

        // Verificar si el usuario está activo
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Tu cuenta ha sido desactivada. Contacta al administrador.',
            ], 403);
        }

        // Verificar si el usuario tiene uno de los roles permitidos
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'No tienes permiso para acceder a este recurso.',
                'required_roles' => $roles,
                'your_role' => $user->role,
            ], 403);
        }

        return $next($request);
    }
}