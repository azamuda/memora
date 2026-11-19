<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $properties = Property::approved()
            ->with(['category', 'images' => fn ($q) => $q->where('is_primary', true), 'user:id,name,phone'])
            ->filter($request->all())
            ->latest()
            ->paginate($request->get('per_page', 12));

        return response()->json($properties);
    }

    public function show(string $slug): JsonResponse
    {
        $property = Property::approved()
            ->with(['category', 'images', 'user:id,name,phone,avatar'])
            ->where('slug', $slug)
            ->firstOrFail();

        $property->increment('views_count');

        return response()->json($property);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'listing_type' => 'required|in:sell,rent',
            'category_id' => 'required|exists:categories,id',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'land_area' => 'required|integer|min:0',
            'building_area' => 'required|integer|min:0',
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $property = $request->user()->properties()->create([
            ...$validated,
            'status' => 'pending',
        ]);

        foreach ($request->file('images') as $i => $file) {
            $path = $file->store("properties/{$property->id}", 'public');
            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $path,
                'is_primary' => $i === 0,
                'sort_order' => $i,
            ]);
        }

        return response()->json(
            $property->load(['category', 'images']),
            201
        );
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'listing_type' => 'sometimes|in:sell,rent',
            'category_id' => 'sometimes|exists:categories,id',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'province' => 'sometimes|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'land_area' => 'sometimes|integer|min:0',
            'building_area' => 'sometimes|integer|min:0',
        ]);

        $property->update($validated);

        // Hapus gambar yang dipilih
        if ($request->has('delete_image_ids')) {
            PropertyImage::whereIn('id', $request->delete_image_ids)
                ->where('property_id', $property->id)
                ->each(fn ($img) => $img->delete());
        }

        // Tambah gambar baru
        if ($request->hasFile('new_images')) {
            $currentMax = $property->images()->max('sort_order') ?? -1;
            foreach ($request->file('new_images') as $i => $file) {
                $path = $file->store("properties/{$property->id}", 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $path,
                    'is_primary' => false,
                    'sort_order' => $currentMax + $i + 1,
                ]);
            }
        }

        return response()->json($property->load(['category', 'images']));
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->authorize('delete', $property);
        $property->delete();

        return response()->json(['message' => 'Properti berhasil dihapus.']);
    }

    public function myProperties(Request $request): JsonResponse
    {
        $properties = $request->user()
            ->properties()
            ->with(['category', 'images' => fn ($q) => $q->where('is_primary', true)])
            ->withCount('inquiries')
            ->latest()
            ->paginate(10);

        return response()->json($properties);
    }

    public function agentStats(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'total_properties' => $user->properties()->count(),
            'approved' => $user->properties()->where('status', 'approved')->count(),
            'pending' => $user->properties()->where('status', 'pending')->count(),
            'total_views' => $user->properties()->sum('views_count'),
            'total_inquiries' => Inquiry::whereIn(
                'property_id',
                $user->properties()->pluck('id')
            )->count(),
        ]);
    }
}
