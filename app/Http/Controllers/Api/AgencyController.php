<?php
// app/Http/Controllers/Api/AgencyController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AgencyController extends Controller
{
    // Dashboard stats
    public function statistics(Request $request)
    {
        $agencyId = $request->user()->agency->id;

        $stats = [
            'total_tours' => Tour::where('agency_id', $agencyId)->count(),
            'active_bookings' => Booking::where('agency_id', $agencyId)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->count(),
            'total_revenue' => Booking::where('agency_id', $agencyId)
                ->whereIn('status', ['confirmed', 'in_progress', 'completed'])
                ->sum('total_price'),
            'total_reviews' => DB::table('reviews')
                ->where('agency_id', $agencyId)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }

    // Listar tours de la agencia
    public function tours(Request $request)
    {
        $query = Tour::where('agency_id', $request->user()->agency->id)
            ->with(['category', 'images']);

        if ($request->has('limit')) {
            $tours = $query->limit($request->limit)->get();
            return response()->json([
                'success' => true,
                'data' => $tours,
            ]);
        }

        $tours = $query->paginate($request->per_page ?? 15);

        return response()->json($tours);
    }



    // Dashboard principal
    public function dashboard(Request $request)
    {
        $agencyId = $request->user()->agency->id;

        $data = [
            'stats' => [
                'total_tours' => Tour::where('agency_id', $agencyId)->count(),
                'active_bookings' => Booking::where('agency_id', $agencyId)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->count(),
                'total_revenue' => Booking::where('agency_id', $agencyId)
                    ->where('status', 'completed')
                    ->sum('total_price'),
            ],
            'recent_tours' => Tour::where('agency_id', $agencyId)
                ->latest()
                ->limit(5)
                ->get(),
            'recent_bookings' => Booking::where('agency_id', $agencyId)
                ->with(['user', 'tour'])
                ->latest()
                ->limit(5)
                ->get(),
        ];

        return response()->json($data);
    }

    // Listar reservas de la agencia
    public function bookings(Request $request)
    {
        $agencyId = $request->user()->agency->id;
        
        $query = Booking::where('agency_id', $agencyId)
            ->with(['tour.images', 'user', 'payment']);

        // Filtro por estado
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Ordenar por más reciente
        $bookings = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json($bookings);
    }

    // Ver agencia pública
    public function show($id)
    {
        $agency = \App\Models\Agency::with(['user', 'tours' => function ($query) {
            $query->where('is_published', true)->where('is_active', true);
        }])->findOrFail($id);

        return response()->json($agency);
    }

    // Listar agencias (público)
    public function index(Request $request)
    {
        $agencies = \App\Models\Agency::with('user')
            ->where('is_verified', true)
            ->paginate($request->per_page ?? 12);

        return response()->json($agencies);
    }

    // Actualizar perfil de agencia
    public function update(Request $request)
    {
        $agency = $request->user()->agency;

        $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'website' => 'sometimes|url',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
        ]);

        $agency->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado exitosamente',
            'data' => $agency,
        ]);
    }
}