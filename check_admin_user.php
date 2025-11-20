<?php
require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use App\Models\User;

try {
    $user = User::where('email', 'admin@test.com')->first();
    
    if ($user) {
        echo "User found:\n";
        echo "Email: " . $user->email . "\n";
        echo "Role: " . $user->role . "\n";
        echo "Status: " . $user->status . "\n";
        echo "Password hash: " . $user->password . "\n";
    } else {
        echo "User not found\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}