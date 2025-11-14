<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Create a pending supervisor user for testing
$pendingUser = DB::table('users')->where('email', 'pending-supervisor@ruaa.com')->first();

if (!$pendingUser) {
    $userId = DB::table('users')->insertGetId([
        'name' => 'Pending Supervisor',
        'email' => 'pending-supervisor@ruaa.com',
        'password' => Hash::make('pending123'),
        'role' => 1, // supervisor
        'status' => 'pending',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    echo "✅ Created pending supervisor user with ID: $userId\n";
} else {
    echo "ℹ️ Pending supervisor user already exists\n";
}

// Also create a suspended user for testing
$suspendedUser = DB::table('users')->where('email', 'suspended-supervisor@ruaa.com')->first();

if (!$suspendedUser) {
    $userId = DB::table('users')->insertGetId([
        'name' => 'Suspended Supervisor',
        'email' => 'suspended-supervisor@ruaa.com',
        'password' => Hash::make('suspended123'),
        'role' => 1, // supervisor
        'status' => 'suspended',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    echo "✅ Created suspended supervisor user with ID: $userId\n";
} else {
    echo "ℹ️ Suspended supervisor user already exists\n";
}