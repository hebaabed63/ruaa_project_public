<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;

// Load Laravel application
$app = require_once 'bootstrap/app.php';

// Bootstrap the application
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test login with the created user
$email = 'test@example.com';
$password = 'password';

echo "Testing login for user: $email\n";

// Get the user from database
$user = App\Models\User::where('email', $email)->first();

if (!$user) {
    echo "User not found in database\n";
    exit(1);
}

echo "User found in database\n";
echo "User ID: " . $user->user_id . "\n";
echo "User name: " . $user->name . "\n";
echo "User email: " . $user->email . "\n";
echo "User status: " . $user->status . "\n";
echo "User role: " . $user->role . "\n";

// Check if password matches
if (Hash::check($password, $user->password)) {
    echo "Password matches!\n";
} else {
    echo "Password does NOT match!\n";
    echo "Stored hash: " . $user->password . "\n";
    exit(1);
}

// Test Laravel Auth attempt
$credentials = [
    'email' => $email,
    'password' => $password
];

if (Auth::attempt($credentials)) {
    echo "Laravel Auth::attempt() successful!\n";
    $authenticatedUser = Auth::user();
    echo "Authenticated user ID: " . $authenticatedUser->user_id . "\n";
} else {
    echo "Laravel Auth::attempt() failed!\n";
}

?>