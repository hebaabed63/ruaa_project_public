<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // محو أي مستخدمين موجودين
        DB::table('users')->where('email', 'parent@test.com')->delete();
        DB::table('users')->where('email', 'admin@test.com')->delete();
        
        // إنشاء مستخدم تجريبي للاختبار (ولي أمر)
        DB::table('users')->insert([
            'name' => 'ولي أمر تجريبي',
            'email' => 'parent@test.com',
            'password' => Hash::make('password123'),
            'role' => 3, // Parent role (role: 0=Admin, 1=Supervisor, 2=School Manager, 3=Parent)
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // إنشاء أدمن تجريبي
        DB::table('users')->insert([
            'name' => 'مدير النظام',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 0, // Admin role
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "تم إنشاء المستخدمين التجريبيين بنجاح!\n";
        echo "- parent@test.com : ولي أمر\n";
        echo "- admin@test.com : مدير النظام\n";
        echo "كلمة المرور لجميع الحسابات: password123\n";
    }
}
