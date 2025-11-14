<?php
// Test script to simulate the Google OAuth flow for a supervisor
require_once 'vendor/autoload.php';

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Database\Capsule\Manager as Capsule;

// Create a new Capsule instance
$capsule = new Capsule;
$app = new \Illuminate\Container\Container;
$app->instance('app', $app);

$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'rua_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix' => '',
]);

// Make this Capsule instance available globally via static methods
$capsule->setAsGlobal();

// Setup the Eloquent ORM
$capsule->bootEloquent();

echo "=== Google OAuth Flow Test for Supervisor ===\n\n";

// 1. Check if there's a supervisor user with a specific email
$email = "supervisor@test.com"; // Change this to the email you're testing with
$user = Capsule::table('users')->where('email', $email)->first();

if (!$user) {
    echo "No user found with email: $email\n";
    exit(1);
}

echo "User found in database:\n";
echo "- ID: " . $user->user_id . "\n";
echo "- Name: " . $user->name . "\n";
echo "- Email: " . $user->email . "\n";
echo "- Role: " . $user->role . " (1 = supervisor)\n";
echo "- Status: " . $user->status . " (active/pending/suspended)\n";
echo "- Google ID: " . $user->google_id . "\n";

// Check if user is a supervisor
if ($user->role != 1) {
    echo "❌ User is not a supervisor (role != 1)\n";
    exit(1);
}

echo "\n=== Simulating Google OAuth Callback Response ===\n";

// Simulate what the backend would send to the frontend
$roleNames = [
    0 => 'admin',
    1 => 'supervisor', 
    2 => 'school_manager',
    3 => 'parent'
];

// Create the user data that would be sent to the frontend
$userData = [
    'user_id' => $user->user_id,
    'name' => $user->name,
    'email' => $user->email,
    'avatar' => $user->avatar,
    'role' => $user->role,
    'status' => $user->status
];

// Simulate token creation (in real scenario, this would be a Sanctum token)
$token = base64_encode(random_bytes(32)); // Mock token
$role = $roleNames[$user->role] ?? 'parent';
$userBase64 = base64_encode(json_encode($userData));

echo "Backend would send to frontend:\n";
echo "- success: true\n";
echo "- token: $token\n";
echo "- role: $role\n";
echo "- user (base64): $userBase64\n";

// Decode to show what frontend would receive
$decodedUser = json_decode(base64_decode($userBase64), true);
echo "\nFrontend would decode user data as:\n";
echo "- User ID: " . $decodedUser['user_id'] . "\n";
echo "- Name: " . $decodedUser['name'] . "\n";
echo "- Email: " . $decodedUser['email'] . "\n";
echo "- Role: " . $decodedUser['role'] . "\n";
echo "- Status: " . $decodedUser['status'] . "\n";

echo "\n=== Expected Frontend Behavior ===\n";
if ($decodedUser['status'] === 'pending') {
    echo "❌ Supervisor is pending - should redirect to /pending-approval\n";
} else if ($decodedUser['status'] === 'active' && $decodedUser['role'] == 1) {
    echo "✅ Supervisor is active - should redirect to /dashboard/supervisor\n";
} else {
    echo "? Unexpected user status or role\n";
}

echo "\n=== Test Complete ===\n";