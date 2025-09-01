<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin User
        User::create([
            'name' => 'أحمد أبو عودة',
            'email' => 'admin@ruaa.ps',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // School Managers
        $managers = [
            [
                'name' => 'محمد خالد',
                'email' => 'mohamed.khaled@school.ps',
                'password' => Hash::make('school123'),
                'role' => 'school_manager',
            ],
            [
                'name' => 'سارة أحمد',
                'email' => 'sara.ahmed@school.ps',
                'password' => Hash::make('school123'),
                'role' => 'school_manager',
            ],
            [
                'name' => 'خالد سليمان',
                'email' => 'khaled.soliman@school.ps',
                'password' => Hash::make('school123'),
                'role' => 'school_manager',
            ]
        ];

        // Supervisors
        $supervisors = [
            [
                'name' => 'علي حسين',
                'email' => 'ali.hussein@edu.ps',
                'password' => Hash::make('supervisor123'),
                'role' => 'supervisor',
            ],
            [
                'name' => 'لمى عبد الرحمن',
                'email' => 'lama.abed@edu.ps',
                'password' => Hash::make('supervisor123'),
                'role' => 'supervisor',
            ]
        ];

        // Parents
        $parents = [
            [
                'name' => 'أحمد محمد',
                'email' => 'ahmed.mohamed@parent.ps',
                'password' => Hash::make('parent123'),
                'role' => 'parent',
            ],
            [
                'name' => 'هناء إبراهيم',
                'email' => 'haneen.ibrahim@parent.ps',
                'password' => Hash::make('parent123'),
                'role' => 'parent',
            ]
        ];

        // Create all users
        foreach (array_merge($managers, $supervisors, $parents) as $user) {
            User::create($user);
        }
    }
}
