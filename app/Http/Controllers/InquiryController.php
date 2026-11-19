<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|min:10|max:1000',
        ]);

        $inquiry = $property->inquiries()->create([
            ...$validated,
            'sender_id' => $request->user()?->id,
        ]);

        return response()->json($inquiry, 201);
    }

    public function myInquiries(Request $request): JsonResponse
    {
        $inquiries = Inquiry::whereIn(
            'property_id',
            $request->user()->properties()->pluck('id')
        )
            ->with('property:id,title,slug')
            ->latest()
            ->paginate(15);

        return response()->json($inquiries);
    }

    public function markRead(Inquiry $inquiry): JsonResponse
    {
        $inquiry->update(['is_read' => true]);

        return response()->json(['message' => 'Ditandai sudah dibaca.']);
    }
}
