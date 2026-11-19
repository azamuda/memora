<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favorites()
            ->with(['category', 'images' => fn ($q) => $q->where('is_primary', true)])
            ->paginate(12);

        return response()->json($favorites);
    }

    public function toggle(Request $request, Property $property): JsonResponse
    {
        $user = $request->user();
        $exists = $user->favorites()->where('property_id', $property->id)->exists();

        if ($exists) {
            $user->favorites()->detach($property->id);

            return response()->json(['favorited' => false]);
        }

        $user->favorites()->attach($property->id);

        return response()->json(['favorited' => true]);
    }
}
