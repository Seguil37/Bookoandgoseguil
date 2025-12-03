<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;
use App\Models\Booking;

class ReviewPolicy
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
     * Ver reseñas (público)
     */
    public function viewAny(?User $user): bool
    {
        return true; // Cualquiera puede ver reseñas aprobadas
    }

    /**
     * Ver una reseña específica
     */
    public function view(?User $user, Review $review): bool
    {
        // Público puede ver reseñas aprobadas
        if (!$user) {
            return $review->is_approved;
        }

        // Autor puede ver su propia reseña
        if ($review->user_id === $user->id) {
            return true;
        }

        // Agencia puede ver reseñas de sus tours
        if ($user->isAgency() 
            && $user->agency 
            && $review->agency_id === $user->agency->id) {
            return true;
        }

        // Otros solo ven aprobadas
        return $review->is_approved;
    }

    /**
     * Crear reseña
     */
    public function create(User $user): bool
    {
        // Solo clientes pueden crear reseñas
        return $user->isCustomer();
    }

    /**
     * Verificar si puede crear reseña para un booking específico
     */
    public function createForBooking(User $user, Booking $booking): bool
    {
        // Solo el cliente que hizo la reserva
        if ($booking->user_id !== $user->id) {
            return false;
        }

        // La reserva debe estar completada
        if (!$booking->canBeReviewed()) {
            return false;
        }

        // No debe tener ya una reseña para este tour
        return !Review::where('user_id', $user->id)
            ->where('tour_id', $booking->tour_id)
            ->exists();
    }

    /**
     * Actualizar reseña (solo autor, antes de 24 horas)
     */
    public function update(User $user, Review $review): bool
    {
        // Solo el autor
        if ($review->user_id !== $user->id) {
            return false;
        }

        // Solo dentro de 24 horas de creación
        return $review->created_at->diffInHours(now()) < 24;
    }

    /**
     * Eliminar reseña
     */
    public function delete(User $user, Review $review): bool
    {
        // Solo el autor puede eliminar
        return $review->user_id === $user->id;
    }

    /**
     * Aprobar/rechazar reseña (solo admin)
     */
    public function moderate(User $user, Review $review): bool
    {
        // Solo lo puede hacer admin (before())
        return false;
    }

    /**
     * Marcar como útil
     */
    public function markHelpful(?User $user, Review $review): bool
    {
        // Cualquiera puede marcar como útil
        return true;
    }

    /**
     * Responder a reseña (solo agencia dueña)
     */
    public function respond(User $user, Review $review): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $review->agency_id === $user->agency->id;
    }
}