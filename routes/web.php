<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Required for Sanctum SPA authentication
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Add a named login route to prevent errors in the Authenticate middleware
Route::get('/login', function () {
    return redirect('/');
})->name('login');

// Email verification route that redirects to frontend
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmailAndRedirect']);

// Supervisor email verification route that redirects to frontend
Route::get('/verify-supervisor-email/{token}', [AuthController::class, 'verifySupervisorEmailAndRedirect']);

// Check email page - shown after registration
Route::get('/check-email', function () {
    return view('check-email');
});

// Email verification page - shown when users click verification link
Route::get('/email-verification', function () {
    return view('email-verification');
});