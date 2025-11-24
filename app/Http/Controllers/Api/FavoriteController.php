<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $favorites = $user->favorites()
            ->with(['agency', 'category', 'images'])
            ->active()
            ->paginate(12);

        return response()->json($favorites);
    }

    public function toggle(Request $request, $tourId)
    {
        $user = $request->user();
        $tour = Tour::findOrFail($tourId);

        if ($user->hasFavorite($tour)) {
            $user->favorites()->detach($tour->id);
            $message = 'Tour eliminado de favoritos';
            $isFavorite = false;
        } else {
            $user->favorites()->attach($tour->id);
            $message = 'Tour agregado a favoritos';
            $isFavorite = true;
        }

        return response()->json([
            'message' => $message,
            'is_favorite' => $isFavorite
        ]);
    }
}