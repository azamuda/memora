<?php

use Illuminate\Support\Facades\Route;

// Semua request yang bukan /api dilayani oleh React SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
