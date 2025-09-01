<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupervisorSchoolSeeder extends Seeder
{
    public function run()
    {
        // Get all supervisors
        $supervisors = User::where('role', 'supervisor')->get();
        
        // Assign each supervisor to one or more schools
        $assignments = [
            // First supervisor supervises schools 1 and 2
            ['supervisor_id' => $supervisors[0]->user_id, 'school_id' => 1],
            ['supervisor_id' => $supervisors[0]->user_id, 'school_id' => 2],
            // Second supervisor supervises schools 2 and 3
            ['supervisor_id' => $supervisors[1]->user_id, 'school_id' => 2],
            ['supervisor_id' => $supervisors[1]->user_id, 'school_id' => 3],
        ];

        // Insert the assignments
        foreach ($assignments as $assignment) {
            DB::table('supervisor_school')->insert([
                'supervisor_id' => $assignment['supervisor_id'],
                'school_id' => $assignment['school_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
