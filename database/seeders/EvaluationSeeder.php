<?php

namespace Database\Seeders;

use App\Models\Evaluation;
use App\Models\EvaluationCriterion;
use Illuminate\Database\Seeder;

class EvaluationSeeder extends Seeder
{
    public function run()
    {
        // Get all criteria
        $criteria = \App\Models\Criterion::all();
        
        // Create evaluations for each school
        for ($schoolId = 1; $schoolId <= 3; $schoolId++) {
            // Supervisor evaluation
            $supervisorEval = Evaluation::create([
                'school_id' => $schoolId,
                'supervisor_id' => $schoolId <= 2 ? 4 : 5, // Supervisor IDs start from 4
                'date' => now()->subDays(rand(1, 30)),
            ]);

            // Parent evaluation
            $parentEval = Evaluation::create([
                'school_id' => $schoolId,
                'parent_id' => $schoolId <= 2 ? 6 : 7, // Parent IDs start from 6
                'date' => now()->subDays(rand(1, 30)),
            ]);

            // Add criteria scores for supervisor evaluation
            foreach ($criteria as $criterion) {
                EvaluationCriterion::create([
                    'evaluation_id' => $supervisorEval->evaluation_id,
                    'criterion_id' => $criterion->criterion_id,
                    'score' => rand(3, 5), // Score between 3-5 for supervisors
                ]);
            }

            // Add criteria scores for parent evaluation
            foreach ($criteria as $criterion) {
                EvaluationCriterion::create([
                    'evaluation_id' => $parentEval->evaluation_id,
                    'criterion_id' => $criterion->criterion_id,
                    'score' => rand(2, 5), // Score between 2-5 for parents
                ]);
            }
        }
    }
}
