<?php

// ==================== ReviewController.php ====================
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'tour'])->approved();

        if ($request->has('tour_id')) {
            $query->where('tour_id', $request->tour_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reviews = $query->latest()->paginate(15);

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:1000',
            'service_rating' => 'nullable|integer|min:1|max:5',
            'value_rating' => 'nullable|integer|min:1|max:5',
            'guide_rating' => 'nullable|integer|min:1|max:5',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
        ]);

        $user = $request->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Verificar que el usuario hizo la reserva
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso para reseñar este tour'
            ], 403);
        }

        // Verificar que no haya reseñado antes
        if (Review::where('user_id', $user->id)
                  ->where('tour_id', $validated['tour_id'])
                  ->exists()) {
            return response()->json([
                'message' => 'Ya has dejado una reseña para este tour'
            ], 422);
        }

        // Subir imágenes
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imageUrls[] = $path;
            }
        }

        $review = Review::create([
            'user_id' => $user->id,
            'tour_id' => $validated['tour_id'],
            'booking_id' => $validated['booking_id'],
            'agency_id' => $booking->agency_id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'comment' => $validated['comment'],
            'service_rating' => $validated['service_rating'] ?? null,
            'value_rating' => $validated['value_rating'] ?? null,
            'guide_rating' => $validated['guide_rating'] ?? null,
            'images' => !empty($imageUrls) ? $imageUrls : null,
            'is_verified' => $booking->status === 'completed',
        ]);

        // Actualizar rating del tour
        $review->tour->updateRating();
        $review->agency->updateRating();

        return response()->json([
            'message' => 'Reseña creada exitosamente',
            'review' => $review->load('user')
        ], 201);
    }

    public function markHelpful($id)
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');

        return response()->json([
            'message' => 'Marcado como útil',
            'helpful_count' => $review->helpful_count
        ]);
    }
}