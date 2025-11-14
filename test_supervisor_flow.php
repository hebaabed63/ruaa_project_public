<?php
// Test script to simulate the supervisor flow
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

echo "=== Supervisor Flow Test ===\n\n";

// 1. Check if there's a supervisor user with a specific email
$email = "supervisor@test.com"; // Change this to the email you're testing with
$user = Capsule::table('users')->where('email', $email)->first();

if (!$user) {
    echo "No user found with email: $email\n";
    echo "Creating a test supervisor user...\n";
    
    // Create a test supervisor user
    $userId = Capsule::table('users')->insertGetId([
        'name' => 'Test Supervisor',
        'email' => $email,
        'password' => password_hash('Test123$', PASSWORD_DEFAULT),
        'role' => 1, // supervisor
        'status' => 'pending',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    $user = Capsule::table('users')->where('user_id', $userId)->first();
    echo "Created test supervisor with ID: $userId\n";
} else {
    echo "Found user with email: $email\n";
}

echo "User Details:\n";
echo "- ID: " . $user->user_id . "\n";
echo "- Name: " . $user->name . "\n";
echo "- Email: " . $user->email . "\n";
echo "- Role: " . $user->role . " (1 = supervisor)\n";
echo "- Status: " . $user->status . " (pending/active/suspended)\n";
echo "- Google ID: " . ($user->google_id ?: 'None') . "\n\n";

// 2. Simulate admin approval
if ($user->status === 'pending') {
    echo "Simulating admin approval...\n";
    Capsule::table('users')->where('user_id', $user->user_id)->update([
        'status' => 'active',
        'updated_at' => now()
    ]);
    
    // Fetch updated user
    $user = Capsule::table('users')->where('user_id', $user->user_id)->first();
    echo "User status updated to: " . $user->status . "\n\n";
}

// 3. Simulate Google OAuth login
echo "Simulating Google OAuth login flow...\n";
echo "When supervisor logs in via Google OAuth:\n";
echo "- System finds user by email: $email\n";
echo "- User role: " . ($user->role == 1 ? 'supervisor' : 'other') . "\n";
echo "- User status: " . $user->status . "\n";

if ($user->status === 'active' && $user->role == 1) {
    echo "- ✓ Supervisor is active and should be allowed to access dashboard\n";
    echo "- Expected redirect: /dashboard/supervisor\n";
} else if ($user->status === 'pending' && $user->role == 1) {
    echo "- ⚠ Supervisor is pending and should be redirected to pending approval page\n";
    echo "- Expected redirect: /pending-approval\n";
} else {
    echo "- ? User status or role not matching expected values\n";
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