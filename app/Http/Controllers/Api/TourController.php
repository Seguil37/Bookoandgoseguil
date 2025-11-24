<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $query = Tour::with(['category', 'agency.user', 'images'])
            ->where('is_published', true)
            ->where('is_active', true);

        // 🔍 BÚSQUEDA POR TEXTO
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%')
                ->orWhere('location_city', 'like', '%' . $request->search . '%');
            });
        }

        // 📍 FILTRO POR UBICACIÓN
        if ($request->has('location') && $request->location) {
            $query->where(function ($q) use ($request) {
                $q->where('location_city', 'like', '%' . $request->location . '%')
                ->orWhere('location_region', 'like', '%' . $request->location . '%');
            });
        }

        // 📂 FILTRO POR CATEGORÍA
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // 💰 FILTRO POR RANGO DE PRECIOS
        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // ⭐ FILTRO POR RATING
        if ($request->has('min_rating') && $request->min_rating) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // ⏱️ FILTRO POR DURACIÓN
        if ($request->has('duration') && $request->duration) {
            switch ($request->duration) {
                case 'short': // Menos de 4 horas
                    $query->where('duration_days', 0)
                        ->where('duration_hours', '<', 4);
                    break;
                case 'medium': // 4-8 horas
                    $query->where('duration_days', 0)
                        ->whereBetween('duration_hours', [4, 8]);
                    break;
                case 'day': // 1 día completo
                    $query->where('duration_days', 1);
                    break;
                case 'multi': // Más de 1 día
                    $query->where('duration_days', '>', 1);
                    break;
            }
        }

        // 🔥 FILTRO POR DIFICULTAD
        if ($request->has('difficulty') && $request->difficulty) {
            $query->where('difficulty_level', $request->difficulty);
        }

        // 🎯 ORDENAMIENTO
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'popular':
                $query->orderBy('total_bookings', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        // Paginación
        $perPage = $request->get('per_page', 12);
        $tours = $query->paginate($perPage);

        return response()->json($tours);
    }

    public function show($id)
    {
        $tour = Tour::with([
            'agency.user',
            'category',
            'images',
            'reviews' => function($query) {
                $query->approved()->latest()->limit(10);
            },
            'reviews.user'
        ])->findOrFail($id);

        return response()->json($tour);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isAgency() || !$user->agency) {
            return response()->json([
                'message' => 'Solo las agencias pueden crear tours'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'itinerary' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',
            'requirements' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'duration_days' => 'required|integer|min:1',
            'duration_hours' => 'nullable|integer|min:0|max:23',
            'max_people' => 'required|integer|min:1',
            'min_people' => 'nullable|integer|min:1',
            'difficulty_level' => 'nullable|in:easy,moderate,hard',
            'location_city' => 'required|string|max:100',
            'location_region' => 'required|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'featured_image' => 'required|image|max:5120', // 5MB
            'available_from' => 'nullable|date',
            'available_to' => 'nullable|date|after:available_from',
            'available_days' => 'nullable|array',
        ]);

        // Upload featured image
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('tours', 'public');
            $validated['featured_image'] = $path;
        }

        $validated['agency_id'] = $user->agency->id;
        $validated['slug'] = Str::slug($validated['title']);

        $tour = Tour::create($validated);

        return response()->json([
            'message' => 'Tour creado exitosamente',
            'tour' => $tour->load('category', 'images')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);
        $user = $request->user();

        if ($tour->agency_id !== $user->agency->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permiso para editar este tour'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'max_people' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
            // ... otros campos
        ]);

        if ($request->hasFile('featured_image')) {
            // Eliminar imagen anterior
            if ($tour->featured_image) {
                Storage::disk('public')->delete($tour->featured_image);
            }
            $path = $request->file('featured_image')->store('tours', 'public');
            $validated['featured_image'] = $path;
        }

        $tour->update($validated);

        return response()->json([
            'message' => 'Tour actualizado exitosamente',
            'tour' => $tour
        ]);
    }

    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);
        $user = request()->user();

        if ($tour->agency_id !== $user->agency->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este tour'
            ], 403);
        }

        $tour->delete(); // Soft delete

        return response()->json([
            'message' => 'Tour eliminado exitosamente'
        ]);
    }

    public function featured()
    {
        $tours = Tour::with(['agency', 'category', 'images'])
            ->active()
            ->featured()
            ->limit(8)
            ->get();

        return response()->json($tours);
    }

    public function related($id)
    {
        $tour = Tour::findOrFail($id);
        
        $relatedTours = Tour::with(['agency', 'category', 'images'])
            ->active()
            ->where('id', '!=', $id)
            ->where(function($query) use ($tour) {
                $query->where('category_id', $tour->category_id)
                      ->orWhere('location_city', $tour->location_city);
            })
            ->limit(4)
            ->get();

        return response()->json($relatedTours);
    }
}