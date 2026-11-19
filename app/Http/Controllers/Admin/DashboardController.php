<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users' => User::count(),
            'total_agents' => User::where('role', 'agent')->count(),
            'total_properties' => Property::count(),
            'pending_approval' => Property::where('status', 'pending')->count(),
            'approved' => Property::where('status', 'approved')->count(),
            'total_inquiries' => Inquiry::count(),
        ]);
    }
}
