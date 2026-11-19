<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::withCount('properties')
            ->latest()
            ->paginate(15);

        return response()->json($users);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $request->validate(['role' => 'required|in:buyer,agent,admin']);
        $user->update(['role' => $request->role]);

        return response()->json(['message' => 'Role diperbarui.', 'user' => $user]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri.'], 403);
        }
        $user->delete();

        return response()->json(['message' => 'User dihapus.']);
    }
}
