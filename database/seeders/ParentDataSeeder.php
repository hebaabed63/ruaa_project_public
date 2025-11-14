<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ParentChild;
use App\Models\School;
use Illuminate\Support\Facades\Hash;

class ParentDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // البحث عن parent@ruaa.com أو إنشائه
        $parent = User::where('email', 'parent@ruaa.com')->first();
        
        if (!$parent) {
            $parent = User::create([
                'name' => 'أحمد محمد',
                'email' => 'parent@ruaa.com',
                'password' => Hash::make('password'),
                'role' => 3, // Parent
                'phone' => '0501234567',
                'address' => 'الرياض، حي النخيل',
            ]);
            
            $this->command->info('تم إنشاء مستخدم جديد: parent@ruaa.com');
        } else {
            $this->command->info('المستخدم موجود: parent@ruaa.com');
        }

        // الحصول على مدارس موجودة
        $schools = School::limit(3)->get();

        if ($schools->isEmpty()) {
            $this->command->warn('لا توجد مدارس في قاعدة البيانات. يرجى تشغيل seeder المدارس أولاً.');
            return;
        }

        // إضافة أطفال لولي الأمر
        $children = [
            [
                'parent_id' => $parent->user_id,
                'school_id' => $schools[0]->school_id,
                'child_name' => 'محمد أحمد',
                'child_grade' => 'الصف الخامس',
                'child_section' => 'أ',
                'status' => 'active',
                'enrollment_date' => now()->subYear(),
            ],
            [
                'parent_id' => $parent->user_id,
                'school_id' => $schools->count() > 1 ? $schools[1]->school_id : $schools[0]->school_id,
                'child_name' => 'فاطمة أحمد',
                'child_grade' => 'الصف الثالث',
                'child_section' => 'ب',
                'status' => 'active',
                'enrollment_date' => now()->subYears(2),
            ],
        ];

        foreach ($children as $childData) {
            ParentChild::updateOrCreate(
                [
                    'parent_id' => $childData['parent_id'],
                    'child_name' => $childData['child_name']
                ],
                $childData
            );
        }

        $this->command->info('تم إضافة بيانات تجريبية لأولياء الأمور بنجاح!');
        $this->command->info('Email: parent@ruaa.com');
        $this->command->info('Password: password');
    }
}
