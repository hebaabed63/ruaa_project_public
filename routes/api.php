<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SchoolController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password/{token}', [AuthController::class, 'resetPassword']);
    
    // Google OAuth routes
    Route::get('/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::post('/google/login', [AuthController::class, 'loginWithGoogle']);
});

// معلومات المستخدم الحالي
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $roleNames = [
        0 => 'admin',
        1 => 'supervisor', 
        2 => 'school_manager',
        3 => 'parent'
    ];
    
    return response()->json([
        'success' => true,
        'data' => [
            'user' => $user,
            'role' => $roleNames[$user->role] ?? 'parent'
        ]
    ]);
});

// مسارات المدارس
Route::prefix('schools')->group(function () {
    Route::get('/', [SchoolController::class, 'index']);
    Route::get('/statistics', [SchoolController::class, 'statistics']);
    Route::get('/{id}', [SchoolController::class, 'show']);
    
    // مسارات تحتاج تسجيل دخول
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [SchoolController::class, 'store']); // للأدمين فقط
        Route::put('/{id}', [SchoolController::class, 'update']); // للأدمين فقط
        Route::delete('/{id}', [SchoolController::class, 'destroy']); // للأدمين فقط
    });
});
