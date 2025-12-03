<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->withCount('tours')
            ->get();

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['tours' => function($query) {
                $query->active()->with(['agency', 'images'])->limit(12);
            }])
            ->firstOrFail();

        return response()->json($category);
    }
}