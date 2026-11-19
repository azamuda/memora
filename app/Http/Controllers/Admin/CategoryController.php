<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:categories,name',
            'slug' => 'required|string|max:50|unique:categories,slug',
            'icon' => 'required|string|max:10',
        ]);

        $category = Category::create($validated);

        return response()->json($category->loadCount('properties'), 201);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->properties()->count() > 0) {
            return response()->json(['message' => 'Kategori masih memiliki properti.'], 422);
        }
        $category->delete();

        return response()->json(['message' => 'Kategori dihapus.']);
    }
}
