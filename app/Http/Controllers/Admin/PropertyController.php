<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $properties = Property::withTrashed()
            ->with(['category:id,name', 'user:id,name,email'])
            ->latest()
            ->paginate(15);

        return response()->json($properties);
    }

    public function approve(Property $property): JsonResponse
    {
        $property->update(['status' => 'approved']);

        return response()->json(['message' => 'Properti disetujui.']);
    }

    public function reject(Property $property): JsonResponse
    {
        $property->update(['status' => 'rejected']);

        return response()->json(['message' => 'Properti ditolak.']);
    }

    public function destroy(Property $property): JsonResponse
    {
        $property->forceDelete();

        return response()->json(['message' => 'Properti dihapus permanen.']);
    }
}
