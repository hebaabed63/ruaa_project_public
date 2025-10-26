<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\Api\SchoolController as ApiSchoolController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\FeedbackController;

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

// ============================================================================
// Schools API Routes - Public Access
// مسارات API للمدارس - متاحة للجميع
// ============================================================================

Route::prefix('schools')->group(function () {
    // Public routes - لا تحتاج تسجيل دخول
    Route::get('/', [ApiSchoolController::class, 'index']); // Get all schools
    Route::get('/best', [ApiSchoolController::class, 'best']); // Best schools
    Route::get('/recent', [ApiSchoolController::class, 'recent']); // Recently added
    Route::get('/search', [ApiSchoolController::class, 'search']); // Search schools
    Route::get('/by-region', [ApiSchoolController::class, 'byRegion']); // By region
    Route::get('/regions', [ApiSchoolController::class, 'regions']); // List regions
    Route::get('/{id}', [ApiSchoolController::class, 'show']); // Single school

    // Protected routes - تحتاج تسجيل دخول
    Route::middleware('auth:sanctum')->group(function () {
        // سيتم إضافة routes للإدارة لاحقاً (Create, Update, Delete)
    });
});

// ============================================================================
// Statistics API Routes
// مسارات API للإحصائيات
// ============================================================================

Route::prefix('statistics')->group(function () {
    Route::get('/general', [ApiSchoolController::class, 'statistics']);
    // سيتم إضافة المزيد من الإحصائيات لاحقاً
});

// ============================================================================
// Public Pages API Routes
// مسارات API للصفحات العامة
// ============================================================================

// About Page - صفحة عن المنصة
Route::get('/about', [AboutController::class, 'index']);

// Contact Routes - صفحة التواصل
Route::prefix('contact')->group(function () {
    Route::get('/info', [ContactController::class, 'getContactInfo']); // Get contact info & map
    Route::post('/', [ContactController::class, 'store']); // Submit contact form
});

// Services - الخدمات
Route::get('/services', [ServiceController::class, 'index']);

// Ratings & Reviews - التقييمات والمراجعات
Route::prefix('ratings')->group(function () {
    Route::get('/criteria', [RatingController::class, 'getEvaluationCriteria']); // Get criteria
    Route::get('/school/{schoolId}', [RatingController::class, 'getSchoolRatings']); // Get school ratings

    // Protected - تحتاج تسجيل دخول
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [RatingController::class, 'store']); // Submit rating
    });
});

// Schools Extended Routes - مسارات المدارس الموسعة
Route::prefix('schools')->group(function () {
    Route::get('/statistics', [ApiSchoolController::class, 'getStatistics']); // Statistics
    Route::get('/best-schools', [ApiSchoolController::class, 'getBestSchools']); // Best schools
});

// Feedback Routes
Route::prefix('feedback')->group(function () {
    Route::post('/', [FeedbackController::class, 'store']);
    Route::get('/', [FeedbackController::class, 'index']);
});

