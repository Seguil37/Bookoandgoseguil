<?php

// ==================== ReviewController.php ====================
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Tour;
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
            'booking_id' => 'nullable|exists:bookings,id',
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
        $tour = Tour::findOrFail($validated['tour_id']);
        $booking = null;

        if (!empty($validated['booking_id'])) {
            $booking = Booking::findOrFail($validated['booking_id']);

            // Verificar que el usuario hizo la reserva
            if ($booking->user_id !== $user->id) {
                return response()->json([
                    'message' => 'No tienes permiso para reseñar este tour'
                ], 403);
            }
        }

        // Subir imágenes
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imageUrls[] = $path;
            }
        }

        $existingReview = Review::withTrashed()
            ->where('user_id', $user->id)
            ->where('tour_id', $validated['tour_id'])
            ->first();

        $payload = [
            'user_id' => $user->id,
            'tour_id' => $validated['tour_id'],
            'booking_id' => $validated['booking_id'] ?? null,
            'agency_id' => $booking?->agency_id ?? $tour->agency_id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'comment' => $validated['comment'],
            'service_rating' => $validated['service_rating'] ?? null,
            'value_rating' => $validated['value_rating'] ?? null,
            'guide_rating' => $validated['guide_rating'] ?? null,
            'images' => !empty($imageUrls) ? $imageUrls : ($existingReview?->images ?? null),
            'is_verified' => $booking?->status === 'completed',
            'is_approved' => true,
        ];

        if ($existingReview) {
            if ($existingReview->trashed()) {
                $existingReview->restore();
            }

            $existingReview->update($payload);
            $review = $existingReview;
            $message = 'Reseña actualizada exitosamente';
        } else {
            $payload['agency_id'] = $payload['agency_id'] ?? optional($booking)->agency_id;
            $review = Review::create($payload);
            $message = 'Reseña creada exitosamente';
        }

        // Actualizar rating del tour y la agencia
        $review->tour->updateRating();
        if ($review->agency) {
            $review->agency->updateRating();
        }

        return response()->json([
            'message' => $message,
            'review' => $review->load('user')
        ], $existingReview ? 200 : 201);
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
