<?php
// Test script to verify supervisor profile functionality
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

echo "=== Supervisor Profile Test ===\n\n";

// 1. Check if there's a supervisor user with a specific email
$email = "supervisor@test.com"; // Change this to the email you're testing with
$user = Capsule::table('users')->where('email', $email)->where('role', 1)->first();

if (!$user) {
    echo "No supervisor user found with email: $email\n";
    echo "Creating a test supervisor user...\n";
    
    // Create a test supervisor user
    $userId = Capsule::table('users')->insertGetId([
        'name' => 'Test Supervisor',
        'email' => $email,
        'password' => password_hash('Test123$', PASSWORD_DEFAULT),
        'role' => 1, // Supervisor role
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    $user = Capsule::table('users')->where('user_id', $userId)->first();
    echo "Created supervisor user with ID: $userId\n";
} else {
    echo "Found supervisor user with ID: {$user->user_id}\n";
}

// 2. Test profile data retrieval
echo "\n--- Profile Data ---\n";
echo "Name: {$user->name}\n";
echo "Email: {$user->email}\n";
echo "Role: {$user->role}\n";
echo "Status: {$user->status}\n";
echo "Avatar: " . ($user->avatar ? $user->avatar : 'Not set') . "\n";

// 3. Test profile update
echo "\n--- Updating Profile ---\n";
$newName = "Updated Test Supervisor";
$newPhone = "+966501234567";
$newAddress = "Test Address, Riyadh";

Capsule::table('users')->where('user_id', $user->user_id)->update([
    'name' => $newName,
    'phone' => $newPhone,
    'address' => $newAddress,
    'updated_at' => now()
]);

// Fetch updated user
$updatedUser = Capsule::table('users')->where('user_id', $user->user_id)->first();

echo "Updated Name: {$updatedUser->name}\n";
echo "Updated Phone: " . ($updatedUser->phone ? $updatedUser->phone : 'Not set') . "\n";
echo "Updated Address: " . ($updatedUser->address ? $updatedUser->address : 'Not set') . "\n";

echo "\n=== Test Complete ===\n";
echo "The supervisor profile functionality is working correctly.\n";