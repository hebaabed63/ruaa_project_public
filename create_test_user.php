<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;

// Load Laravel application
$app = require_once 'bootstrap/app.php';

// Bootstrap the application
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Create a test user
$user = new App\Models\User();
$user->name = 'Test User';
$user->email = 'test@example.com';
$user->password = Hash::make('password');
$user->role = 1; // Admin role
$user->status = 'active';
$user->save();

echo "Test user created successfully!\n";
echo "Email: test@example.com\n";
echo "Password: password\n";