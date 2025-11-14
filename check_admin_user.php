<?php
// Simple script to check admin user
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
    'database' => 'rua_db', // Updated with correct database name
    'username' => 'root', // Update with your username
    'password' => '', // Update with your password
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix' => '',
]);

// Make this Capsule instance available globally via static methods
$capsule->setAsGlobal();

// Setup the Eloquent ORM
$capsule->bootEloquent();

// Query the admin user
$user = Capsule::table('users')->where('email', 'admin@test.com')->first();

if ($user) {
    echo "Admin user found:\n";
    echo "ID: " . $user->user_id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Status: " . $user->status . "\n";
    echo "Google ID: " . $user->google_id . "\n";
    echo "Password: " . $user->password . "\n";
} else {
    echo "Admin user with email admin@test.com not found\n";
    
    // Let's check if there are any users with role 0 (admin)
    $admins = Capsule::table('users')->where('role', 0)->get();
    echo "Found " . count($admins) . " users with role 0 (admin):\n";
    foreach ($admins as $admin) {
        echo "- " . $admin->name . " (" . $admin->email . ") - Status: " . $admin->status . "\n";
    }
}