<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PropertyController as AdminPropertyController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// ─────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{slug}', [PropertyController::class, 'show']);
Route::post('/properties/{property}/inquiries', [InquiryController::class, 'store']);

// ─────────────────────────────────────────
// AUTHENTICATED
// ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{property}/toggle', [FavoriteController::class, 'toggle']);

    // ── AGENT ───────────────────────────
    Route::middleware('role:agent,admin')->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{property}', [PropertyController::class, 'update']);
        Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);
        Route::get('/my-properties', [PropertyController::class, 'myProperties']);
        Route::get('/agent/stats', [PropertyController::class, 'agentStats']);
        Route::get('/my-inquiries', [InquiryController::class, 'myInquiries']);
        Route::patch('/inquiries/{inquiry}/read', [InquiryController::class, 'markRead']);
    });

    // ── ADMIN ────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::post('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'store']);
        Route::delete('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'destroy']);
        Route::get('/properties', [AdminPropertyController::class, 'index']);
        Route::patch('/properties/{property}/approve', [AdminPropertyController::class, 'approve']);
        Route::patch('/properties/{property}/reject', [AdminPropertyController::class, 'reject']);
        Route::delete('/properties/{property}', [AdminPropertyController::class, 'destroy']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
    });
});
