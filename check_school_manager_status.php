<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check if email and password are provided
if ($argc < 3) {
    echo "Usage: php check_school_manager_status.php <email> <password>\n";
    exit(1);
}

$email = $argv[1];
$password = $argv[2];

try {
    // Find the user
    $user = DB::table('users')->where('email', $email)->first();
    
    if (!$user) {
        echo "User not found with email: $email\n";
        exit(1);
    }
    
    echo "User found:\n";
    echo "  ID: " . $user->user_id . "\n";
    echo "  Name: " . $user->name . "\n";
    echo "  Email: " . $user->email . "\n";
    echo "  Role: " . $user->role . "\n";
    echo "  Status: " . $user->status . "\n";
    echo "  Supervisor ID: " . $user->supervisor_id . "\n";
    
    // Check role mapping
    $roleNames = [
        0 => 'admin',
        1 => 'supervisor', 
        2 => 'school_manager',
        3 => 'parent'
    ];
    
    echo "  Role Name: " . ($roleNames[$user->role] ?? 'unknown') . "\n";
    
    // Check password (be careful with this in production!)
    if (password_verify($password, $user->password)) {
        echo "  Password: Correct\n";
    } else {
        echo "  Password: Incorrect\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}