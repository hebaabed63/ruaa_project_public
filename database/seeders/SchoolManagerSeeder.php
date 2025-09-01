<?php

namespace Database\Seeders;

use App\Models\SchoolManager;
use App\Models\User;
use Illuminate\Database\Seeder;

class SchoolManagerSeeder extends Seeder
{
    public function run()
    {
        // Get all school managers
        $managers = User::where('role', 'school_manager')->get();
        
        // Assign each manager to a school
        foreach ($managers as $index => $manager) {
            // School IDs start from 1
            $schoolId = $index + 1;
            
            SchoolManager::create([
                'manager_id' => $manager->user_id,
                'school_id' => $schoolId
            ]);
        }
    }
}
