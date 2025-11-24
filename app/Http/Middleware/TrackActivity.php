<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ActivityLog;

class TrackActivity
{
    /**
     * Registrar actividad del usuario
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Solo registrar para usuarios autenticados
        if ($request->user() && $this->shouldLog($request)) {
            $this->logActivity($request, $response);
        }

        return $response;
    }

    /**
     * Determinar si se debe registrar esta petición
     */
    private function shouldLog(Request $request): bool
    {
        // Solo registrar acciones importantes (no GET)
        $logMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        
        if (!in_array($request->method(), $logMethods)) {
            return false;
        }

        // No registrar rutas de login/logout
        $excludedPaths = [
            'api/v1/login',
            'api/v1/logout',
            'api/v1/register',
        ];

        foreach ($excludedPaths as $path) {
            if (str_contains($request->path(), $path)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Registrar la actividad
     */
    private function logActivity(Request $request, Response $response): void
    {
        try {
            $action = $this->getActionName($request);
            $description = $this->getDescription($request, $action);

            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => $action,
                'model_type' => $this->getModelType($request),
                'model_id' => $this->getModelId($request),
                'description' => $description,
                'changes' => $this->getChanges($request),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Exception $e) {
            // No fallar la petición si el log falla
            \Log::error('Error logging activity: ' . $e->getMessage());
        }
    }

    private function getActionName(Request $request): string
    {
        return match($request->method()) {
            'POST' => 'create',
            'PUT', 'PATCH' => 'update',
            'DELETE' => 'delete',
            default => 'unknown',
        };
    }

    private function getDescription(Request $request, string $action): string
    {
        $user = $request->user();
        $path = $request->path();
        
        return "{$user->name} ({$user->role}) {$action} en {$path}";
    }

    private function getModelType(Request $request): ?string
    {
        // Extraer el tipo de modelo de la ruta
        $path = $request->path();
        
        if (str_contains($path, 'tours')) return 'Tour';
        if (str_contains($path, 'bookings')) return 'Booking';
        if (str_contains($path, 'reviews')) return 'Review';
        if (str_contains($path, 'agencies')) return 'Agency';
        if (str_contains($path, 'users')) return 'User';
        
        return null;
    }

    private function getModelId(Request $request): ?int
    {
        // Intentar obtener el ID del modelo de los parámetros de ruta
        $route = $request->route();
        
        if (!$route) return null;
        
        return $route->parameter('id') 
            ?? $route->parameter('tour') 
            ?? $route->parameter('booking')
            ?? null;
    }

    private function getChanges(Request $request): ?array
    {
        // Solo guardar datos relevantes, no contraseñas ni tokens
        $data = $request->except([
            'password', 
            'password_confirmation', 
            'token', 
            '_token',
            'current_password',
        ]);

        return !empty($data) ? $data : null;
    }
}