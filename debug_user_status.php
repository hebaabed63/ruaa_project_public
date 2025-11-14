<?php
// Simple script to debug user status
require_once 'vendor/autoload.php';

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Database\Capsule\Manager as Capsule;

// Create a new Capsule instance
$capsule = new Capsule;
$app = new \Illuminate\Container\Container;
$app->instance('app', $app);

$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => 'ruaa_db',
    'username'  => 'root',
    'password'  => '',
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

// Make this Capsule instance available globally via static methods
$capsule->setAsGlobal();

// Setup the Eloquent ORM
$capsule->bootEloquent();

// Get user by email
$email = $argv[1] ?? null;

if (!$email) {
    echo "Please provide an email address as argument\n";
    exit(1);
}

// Query the user
$user = Capsule::table('users')->where('email', $email)->first();

if ($user) {
    echo "User found:\n";
    echo "ID: " . $user->user_id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Status: " . $user->status . "\n";
    echo "Google ID: " . $user->google_id . "\n";
} else {
    echo "User with email $email not found\n";
}