<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\ParentChild;
use App\Models\StudentReport;

class StudentReportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 0) نفترض وجود مدرسة بمعرّف 1
        // لو ما كانت موجودة، تأكدي من إضافتها في Seeder آخر قبل هذا، أو عدّلي $schoolId
        $schoolId = 1;

        // 1) أنشئ وليّ أمر (لو مش موجود)
        $parent = User::firstOrCreate(
            ['email' => 'parent@example.com'],
            [
                'name'     => 'أحمد محمد السعد',
                'password' => bcrypt('password123'),
                'role'     => 3, // 3 = Parent
            ]
        );

        // 2) أنشئ طفلين مرتبطين بهذا الوالد في جدول parent_children
        // ملاحظة مهمة: لا نمرّر child_id نهائيًا لأنّه PRIMARY KEY auto-increment في المايغريشن
        $child1 = ParentChild::firstOrCreate(
            [
                'parent_id' => $parent->user_id,
                'school_id' => $schoolId,
                'child_name'=> 'محمد أحمد السعد',
            ],
            [
                'child_grade'     => 'الصف السادس الابتدائي',
                'child_section'   => 'أ',
                'status'          => 'active',
                'enrollment_date' => now(),
            ]
        );

        $child2 = ParentChild::firstOrCreate(
            [
                'parent_id' => $parent->user_id,
                'school_id' => $schoolId,
                'child_name'=> 'سارة أحمد السعد',
            ],
            [
                'child_grade'     => 'الصف الثاني المتوسط',
                'child_section'   => 'ب',
                'status'          => 'active',
                'enrollment_date' => now(),
            ]
        );

        // الآن child_id تم توليده تلقائيًا من الـDB
        // نستخدمه كـ student_id في تقارير StudentReport
        $studentId1 = $child1->child_id;
        $studentId2 = $child2->child_id;

        // 3) تقارير الطالب الأول (استخدمي updateOrCreate لتفادي التكرار إذا أعدتِ التشغيل)
        StudentReport::updateOrCreate(
            ['student_id' => $studentId1, 'term' => '2024-2025-1'],
            [
                'summary' => [
                    'rank_text'   => 'السابع مكرر',
                    'rank_badge'  => 'excellent',
                    'total_score' => 450,
                    'max_score'   => 500,
                    'percentage'  => 90.0
                ],
                'attendance' => [
                    'percentage'   => 95.6,
                    'status'       => 'Excellent',
                    'total_days'   => 90,
                    'present_days' => 86,
                    'absent_days'  => 4
                ],
                'activity' => [
                    'percentage'          => 92.0,
                    'status'              => 'Excellent',
                    'participation_score' => 46,
                    'max_participation'   => 50
                ],
                'grades' => [
                    ['subject' => 'رياضيات',       'score' => 95, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'علوم',           'score' => 88, 'out_of' => 100, 'letter' => 'A',  'status' => 'very_good'],
                    ['subject' => 'لغة عربية',      'score' => 92, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'لغة إنجليزية',   'score' => 85, 'out_of' => 100, 'letter' => 'B+', 'status' => 'very_good'],
                    ['subject' => 'تربية إسلامية',  'score' => 90, 'out_of' => 100, 'letter' => 'A',  'status' => 'excellent'],
                ],
                'homeworks' => [
                    ['subject' => 'رياضيات',       'title' => 'التكليف الرابع - المعادلات',  'status' => 'submitted', 'score' => 20, 'out_of' => 20, 'submitted_date' => '2024-10-15'],
                    ['subject' => 'علوم',           'title' => 'التكليف الثالث - الخلايا',    'status' => 'late',      'score' => 15, 'out_of' => 20, 'submitted_date' => '2024-10-12'],
                    ['subject' => 'لغة عربية',      'title' => 'التكليف الخامس - الإنشاء',    'status' => 'submitted', 'score' => 18, 'out_of' => 20, 'submitted_date' => '2024-10-18'],
                    ['subject' => 'لغة إنجليزية',   'title' => 'Assignment 4 - Grammar',       'status' => 'pending',   'score' => null,'out_of' => 20, 'submitted_date' => null],
                ],
            ]
        );

        StudentReport::updateOrCreate(
            ['student_id' => $studentId1, 'term' => '2023-2024-2'],
            [
                'summary' => [
                    'rank_text'   => 'العاشر',
                    'rank_badge'  => 'very_good',
                    'total_score' => 420,
                    'max_score'   => 500,
                    'percentage'  => 84.0
                ],
                'attendance' => [
                    'percentage'   => 88.9,
                    'status'       => 'Good',
                    'total_days'   => 90,
                    'present_days' => 80,
                    'absent_days'  => 10
                ],
                'activity' => [
                    'percentage'          => 86.0,
                    'status'              => 'Very Good',
                    'participation_score' => 43,
                    'max_participation'   => 50
                ],
                'grades' => [
                    ['subject' => 'رياضيات',       'score' => 85, 'out_of' => 100, 'letter' => 'B+', 'status' => 'very_good'],
                    ['subject' => 'علوم',           'score' => 82, 'out_of' => 100, 'letter' => 'B',  'status' => 'good'],
                    ['subject' => 'لغة عربية',      'score' => 88, 'out_of' => 100, 'letter' => 'A',  'status' => 'very_good'],
                    ['subject' => 'لغة إنجليزية',   'score' => 80, 'out_of' => 100, 'letter' => 'B',  'status' => 'good'],
                    ['subject' => 'تربية إسلامية',  'score' => 85, 'out_of' => 100, 'letter' => 'B+', 'status' => 'very_good'],
                ],
                'homeworks' => [
                    ['subject' => 'رياضيات', 'title' => 'التكليف الثالث', 'status' => 'submitted', 'score' => 18, 'out_of' => 20, 'submitted_date' => '2024-03-15'],
                    ['subject' => 'علوم',     'title' => 'التكليف الثاني', 'status' => 'submitted', 'score' => 16, 'out_of' => 20, 'submitted_date' => '2024-03-10'],
                ],
            ]
        );

        // 4) تقارير الطالب الثاني
        StudentReport::updateOrCreate(
            ['student_id' => $studentId2, 'term' => '2024-2025-1'],
            [
                'summary' => [
                    'rank_text'   => 'الثالث',
                    'rank_badge'  => 'excellent',
                    'total_score' => 470,
                    'max_score'   => 500,
                    'percentage'  => 94.0
                ],
                'attendance' => [
                    'percentage'   => 98.2,
                    'status'       => 'Excellent',
                    'total_days'   => 90,
                    'present_days' => 88,
                    'absent_days'  => 2
                ],
                'activity' => [
                    'percentage'          => 96.0,
                    'status'              => 'Excellent',
                    'participation_score' => 48,
                    'max_participation'   => 50
                ],
                'grades' => [
                    ['subject' => 'رياضيات',       'score' => 98, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'علوم',           'score' => 95, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'لغة عربية',      'score' => 93, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'لغة إنجليزية',   'score' => 92, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                    ['subject' => 'تربية إسلامية',  'score' => 92, 'out_of' => 100, 'letter' => 'A+', 'status' => 'excellent'],
                ],
                'homeworks' => [
                    ['subject' => 'رياضيات', 'title' => 'التكليف الخامس - الهندسة', 'status' => 'submitted', 'score' => 20, 'out_of' => 20, 'submitted_date' => '2024-10-16'],
                    ['subject' => 'علوم',     'title' => 'التكليف الرابع - الكيمياء', 'status' => 'submitted', 'score' => 19, 'out_of' => 20, 'submitted_date' => '2024-10-14'],
                    ['subject' => 'لغة عربية','title' => 'التكليف السادس - النحو',   'status' => 'submitted', 'score' => 20, 'out_of' => 20, 'submitted_date' => '2024-10-19'],
                ],
            ]
        );

        // 5) رسائل مخرجات لطيفة
        $this->command->info('✅ Student reports seeded successfully!');
        $this->command->info('   Parent: ' . $parent->email . ' (ID: ' . $parent->user_id . ')');
        $this->command->info('   Child 1: child_id = ' . $studentId1 . ' (محمد أحمد السعد)');
        $this->command->info('   Child 2: child_id = ' . $studentId2 . ' (سارة أحمد السعد)');
        $this->command->info('   Reports created for terms: 2024-2025-1, 2023-2024-2');
    }
}
