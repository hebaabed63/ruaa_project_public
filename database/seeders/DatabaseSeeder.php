<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SchoolSeeder::class,
            UserSeeder::class,
            SchoolManagerSeeder::class,
            SupervisorSchoolSeeder::class,
            CriteriaSeeder::class,
            EvaluationSeeder::class,
            ConversationSeeder::class,
            MediaGallerySeeder::class,
        ]);
    }
}
