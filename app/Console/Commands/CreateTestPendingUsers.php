<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateTestPendingUsers extends Command
{
    protected $signature = 'test:create-pending-users';
    protected $description = 'Create test pending and suspended users for testing login functionality';

    public function handle()
    {
        $this->info('🚀 Creating test pending and suspended users...');
        
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
            
            $this->info('✅ Created pending supervisor user with ID: ' . $userId);
        } else {
            $this->info('ℹ️ Pending supervisor user already exists');
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
            
            $this->info('✅ Created suspended supervisor user with ID: ' . $userId);
        } else {
            $this->info('ℹ️ Suspended supervisor user already exists');
        }
        
        return 0;
    }
}