<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Booking;

class BookingPolicy
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
     * Ver lista de reservas
     */
    public function viewAny(User $user): bool
    {
        // Cliente o agencia pueden ver sus propias reservas
        return $user->isCustomer() || $user->isAgency();
    }

    /**
     * Ver detalle de una reserva
     */
    public function view(User $user, Booking $booking): bool
    {
        // Cliente puede ver su propia reserva
        if ($user->isCustomer() && $booking->user_id === $user->id) {
            return true;
        }

        // Agencia puede ver reservas de sus tours
        if ($user->isAgency() 
            && $user->agency 
            && $booking->agency_id === $user->agency->id) {
            return true;
        }

        return false;
    }

    /**
     * Crear reserva (cualquier usuario autenticado)
     */
    public function create(User $user): bool
    {
        return $user->isCustomer();
    }

    /**
     * Actualizar reserva
     */
    public function update(User $user, Booking $booking): bool
    {
        // Solo cliente dueño puede actualizar (antes de confirmar)
        return $user->isCustomer() 
            && $booking->user_id === $user->id 
            && $booking->status === 'pending';
    }

    /**
     * Cancelar reserva
     */
    public function cancel(User $user, Booking $booking): bool
    {
        // Cliente puede cancelar su propia reserva
        if ($user->isCustomer() && $booking->user_id === $user->id) {
            return $booking->canBeCancelled();
        }

        // Agencia puede cancelar reservas de sus tours
        if ($user->isAgency() 
            && $user->agency 
            && $booking->agency_id === $user->agency->id) {
            return true;
        }

        return false;
    }

    /**
     * Confirmar reserva (solo agencia)
     */
    public function confirm(User $user, Booking $booking): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $booking->agency_id === $user->agency->id 
            && $booking->status === 'pending';
    }

    /**
     * Marcar como completada (solo agencia)
     */
    public function complete(User $user, Booking $booking): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $booking->agency_id === $user->agency->id 
            && $booking->status === 'in_progress';
    }

    /**
     * Check-in (solo agencia)
     */
    public function checkIn(User $user, Booking $booking): bool
    {
        return $user->isAgency() 
            && $user->agency 
            && $booking->agency_id === $user->agency->id 
            && $booking->status === 'confirmed';
    }

    /**
     * Descargar voucher
     */
    public function downloadVoucher(User $user, Booking $booking): bool
    {
        // Cliente dueño o agencia del tour
        return ($user->isCustomer() && $booking->user_id === $user->id)
            || ($user->isAgency() && $user->agency && $booking->agency_id === $user->agency->id);
    }

    /**
     * Ver mensajes de la reserva
     */
    public function viewMessages(User $user, Booking $booking): bool
    {
        return ($user->isCustomer() && $booking->user_id === $user->id)
            || ($user->isAgency() && $user->agency && $booking->agency_id === $user->agency->id);
    }

    /**
     * Enviar mensaje
     */
    public function sendMessage(User $user, Booking $booking): bool
    {
        return $this->viewMessages($user, $booking);
    }
}