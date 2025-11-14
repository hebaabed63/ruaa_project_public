<?php
// Debug script to test the supervisor Google OAuth flow
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

echo "=== Supervisor Google OAuth Debug ===\n\n";

// 1. Check if there's a supervisor user with a specific email
$email = "supervisor@test.com"; // Change this to the email you're testing with
$user = Capsule::table('users')->where('email', $email)->first();

if (!$user) {
    echo "No user found with email: $email\n";
    exit(1);
}

echo "User found:\n";
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

echo "\n=== Google OAuth Flow Simulation ===\n";

// Simulate what happens when a supervisor logs in via Google OAuth
echo "When supervisor logs in via Google OAuth:\n";
echo "1. System finds user by email: $email\n";
echo "2. User role: " . ($user->role == 1 ? 'supervisor' : 'other') . "\n";
echo "3. User status: " . $user->status . "\n";

if ($user->status === 'active' && $user->role == 1) {
    echo "✅ Supervisor is active and should be allowed to access dashboard\n";
    echo "Expected redirect: /dashboard/supervisor\n";
} else if ($user->status === 'pending' && $user->role == 1) {
    echo "⚠ Supervisor is pending and should be redirected to pending approval page\n";
    echo "Expected redirect: /pending-approval\n";
} else {
    echo "? User status or role not matching expected values\n";
}

echo "\n=== Testing Google OAuth Callback Data ===\n";
// Simulate what the Google OAuth callback would send to the frontend
$roleNames = [
    0 => 'admin',
    1 => 'supervisor', 
    2 => 'school_manager',
    3 => 'parent'
];

$userData = [
    'user_id' => $user->user_id,
    'name' => $user->name,
    'email' => $user->email,
    'avatar' => $user->avatar,
    'role' => $user->role,
    'status' => $user->status
];

echo "Google OAuth callback would send:\n";
echo "- Token: [generated auth token]\n";
echo "- Role: " . ($roleNames[$user->role] ?? 'parent') . "\n";
echo "- User data: " . json_encode($userData, JSON_PRETTY_PRINT) . "\n";

echo "\n=== Test Complete ===\n";