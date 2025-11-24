<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Tour;

class TourPolicy
{
    /**
     * Admin puede hacer todo
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Ver lista de tours (público)
     */
    public function viewAny(?User $user): bool
    {
        return true; // Cualquiera puede ver tours
    }

    /**
     * Ver detalle de un tour (público)
     */
    public function view(?User $user, Tour $tour): bool
    {
        // Público puede ver tours publicados y activos
        if (!$user) {
            return $tour->is_published && $tour->is_active;
        }

        // Dueño puede ver su propio tour aunque no esté publicado
        if ($user->isAgency() && $tour->agency_id === $user->agency?->id) {
            return true;
        }

        // Otros usuarios solo ven tours publicados
        return $tour->is_published && $tour->is_active;
    }

    /**
     * Crear tour (solo agencias)
     */
    public function create(User $user): bool
    {
        return $user->isAgency() && $user->agency !== null;
    }

    /**
     * Actualizar tour (solo dueño)
     */
    public function update(User $user, Tour $tour): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $tour->agency_id === $user->agency->id;
    }

    /**
     * Eliminar tour (solo dueño)
     */
    public function delete(User $user, Tour $tour): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $tour->agency_id === $user->agency->id;
    }

    /**
     * Publicar tour (dueño o admin)
     */
    public function publish(User $user, Tour $tour): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $tour->agency_id === $user->agency->id;
    }

    /**
     * Verificar tour (solo admin)
     */
    public function verify(User $user, Tour $tour): bool
    {
        // Solo lo puede hacer admin (manejado en before())
        return false;
    }

    /**
     * Restaurar tour eliminado
     */
    public function restore(User $user, Tour $tour): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $tour->agency_id === $user->agency->id;
    }

    /**
     * Eliminar permanentemente
     */
    public function forceDelete(User $user, Tour $tour): bool
    {
        // Solo admin puede eliminar permanentemente (before())
        return false;
    }
}