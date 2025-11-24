<?php
// app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Booking::with(['tour.images', 'tour.agency', 'payment']);

        if ($user->isAgency()) {
            $query->where('agency_id', $user->agency->id);
        } else {
            $query->where('user_id', $user->id);
        }

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('upcoming')) {
            $query->upcoming();
        }

        if ($request->has('past')) {
            $query->past();
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json($bookings);
    }

    public function show($id)
    {
        $user = request()->user();
        $booking = Booking::with([
            'tour.images',
            'tour.agency.user',
            'payment',
            'review',
            'documents'
        ])->findOrFail($id);

        // Verificar permisos
        if ($booking->user_id !== $user->id && 
            (!$user->isAgency() || $booking->agency_id !== $user->agency->id)) {
            return response()->json([
                'message' => 'No tienes permiso para ver esta reserva'
            ], 403);
        }

        return response()->json($booking);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'booking_date' => 'required|date|after:today',
            'booking_time' => 'nullable',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'infants' => 'nullable|integer|min:0',
            'special_requests' => 'nullable|string|max:500',
            'total_price' => 'required|numeric|min:0',
            'payment_method' => 'required|in:card,paypal,transfer,yape,plin,mercadopago',
        ]);
    
        $tour = Tour::findOrFail($validated['tour_id']);
        $user = $request->user();
    
        // Calcular total de personas
        $totalPeople = $validated['adults'] + ($validated['children'] ?? 0);
    
        // Validar disponibilidad
        if ($totalPeople > $tour->max_people) {
            return response()->json([
                'message' => "El tour solo acepta un máximo de {$tour->max_people} personas"
            ], 422);
        }
    
        if ($totalPeople < $tour->min_people) {
            return response()->json([
                'message' => "El tour requiere un mínimo de {$tour->min_people} personas"
            ], 422);
        }
    
        // Calcular precios
        $pricePerPerson = $tour->discount_price ?? $tour->price;
        $subtotal = $validated['total_price'];
        $tax = $subtotal * 0.00; // Sin impuestos por ahora
        $discount = 0;
        $totalPrice = $subtotal + $tax - $discount;
    
        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => $user->id,
                'tour_id' => $tour->id,
                'agency_id' => $tour->agency_id,
                'booking_date' => $validated['booking_date'],
                'booking_time' => $validated['booking_time'] ?? null,
                'number_of_people' => $totalPeople,
                'price_per_person' => $pricePerPerson,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total_price' => $totalPrice,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => $user->phone ?? '',
                'special_requirements' => $validated['special_requests'] ?? null,
                'status' => 'confirmed', // ✅ Confirmada directamente al crear
                'confirmed_at' => now(),
            ]);
    
            // Incrementar contador de reservas del tour
            $tour->increment('total_bookings');
    
            DB::commit();
    
            return response()->json([
                'success' => true,
                'message' => 'Reserva creada exitosamente',
                'data' => $booking->load('tour', 'payment')
            ], 201);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $user = $request->user();

        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso para cancelar esta reserva'
            ], 403);
        }

        if (!$booking->canBeCancelled()) {
            return response()->json([
                'message' => 'Esta reserva no puede ser cancelada'
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['reason'] ?? 'Sin razón especificada'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva cancelada exitosamente',
            'data' => $booking
        ]);
    }

    public function confirm($id)
    {
        $booking = Booking::findOrFail($id);
        $user = request()->user();

        if (!$user->isAgency() || $booking->agency_id !== $user->agency->id) {
            return response()->json([
                'message' => 'No tienes permiso para confirmar esta reserva'
            ], 403);
        }

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva confirmada exitosamente',
            'data' => $booking
        ]);
    }

    public function checkIn($id)
    {
        $booking = Booking::findOrFail($id);
        $user = request()->user();

        if (!$user->isAgency() || $booking->agency_id !== $user->agency->id) {
            return response()->json([
                'message' => 'No tienes permiso'
            ], 403);
        }

        $booking->update([
            'status' => 'in_progress',
            'checked_in_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in realizado',
            'data' => $booking
        ]);
    }

    public function complete($id)
    {
        $booking = Booking::findOrFail($id);
        $user = request()->user();

        if (!$user->isAgency() || $booking->agency_id !== $user->agency->id) {
            return response()->json([
                'message' => 'No tienes permiso'
            ], 403);
        }

        $booking->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tour completado',
            'data' => $booking
        ]);
    }
}