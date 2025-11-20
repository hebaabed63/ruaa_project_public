<?php

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

// Check for exact user
$user = DB::table('users')->where('email', 'eslam1@gmail.com')->first();

if($user) {
    echo "User found:\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Status: " . $user->status . "\n";
    echo "Email verified: " . ($user->email_verified_at ? 'Yes' : 'No') . "\n";
} else {
    echo "User with exact email 'eslam1@gmail.com' not found\n";
    
    // Check for similar users
    $users = DB::table('users')->where('email', 'like', '%eslam%')->get();
    if(count($users) > 0) {
        echo "\nSimilar users found:\n";
        foreach($users as $user) {
            echo "- " . $user->name . " (" . $user->email . ") - Role: " . $user->role . " - Status: " . $user->status . "\n";
        }
    } else {
        echo "No similar users found\n";
    }
}