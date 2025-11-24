<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PaymentConfirmedMail;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    /**
     * Crear un pago (simulado por ahora)
     * En producción: integrar con MercadoPago, Stripe, Culqi, etc.
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_method' => 'required|in:card,paypal,yape,plin,mercadopago,transfer,credit_card,debit_card',
        ]);

        $user = $request->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Verificar que el usuario sea dueño de la reserva
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso para realizar este pago'
            ], 403);
        }

        // Verificar que no exista un pago completado
        if ($booking->payment && $booking->payment->isCompleted()) {
            return response()->json([
                'message' => 'Esta reserva ya ha sido pagada'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Crear el pago
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'payment_method' => $validated['payment_method'],
                'amount' => $booking->total_price,
                'currency' => 'PEN',
                'status' => 'processing',
            ]);

            // SIMULACIÓN: En producción aquí iría la integración con pasarela
            // Por ahora, marcamos el pago como completado automáticamente
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            // Actualizar el estado de la reserva
            $booking->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);

            Mail::to($user->email)->send(new PaymentConfirmedMail($payment));

            DB::commit();

            return response()->json([
                'message' => 'Pago procesado exitosamente',
                'payment' => $payment,
                'booking' => $booking->fresh()
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al procesar el pago',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirmar un pago (webhook de pasarela)
     */
    public function confirm(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->isCompleted()) {
            return response()->json([
                'message' => 'Este pago ya fue confirmado'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            $payment->booking->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);

            $user = $payment->user ?? $payment->booking->user;

            if ($user) {
                Mail::to($user->email)->send(new PaymentConfirmedMail($payment));
            }

            DB::commit();

            return response()->json([
                'message' => 'Pago confirmado exitosamente',
                'payment' => $payment
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al confirmar el pago',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener detalles de un pago
     */
    public function show($id)
    {
        $user = request()->user();
        $payment = Payment::with('booking.tour')->findOrFail($id);

        // Verificar permisos
        if ($payment->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permiso para ver este pago'
            ], 403);
        }

        return response()->json($payment);
    }

    /**
     * Reembolsar un pago
     */
    public function refund(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $user = $request->user();

        // Solo admin o la agencia puede hacer reembolsos
        if (!$user->isAdmin() && 
            (!$user->isAgency() || $payment->booking->agency_id !== $user->agency->id)) {
            return response()->json([
                'message' => 'No tienes permiso para reembolsar este pago'
            ], 403);
        }

        if ($payment->status === 'refunded') {
            return response()->json([
                'message' => 'Este pago ya fue reembolsado'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
            ]);

            $payment->booking->update([
                'status' => 'refunded',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Reembolso procesado exitosamente',
                'payment' => $payment
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al procesar el reembolso',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}