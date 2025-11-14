<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\School;
use App\Models\ParentChild;
use App\Models\ParentNotification;
use Illuminate\Support\Facades\Hash;

class ParentDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * إنشاء بيانات تجريبية للوحة تحكم أولياء الأمور
     */
    public function run()
    {
        // 1. إنشاء ولي أمر تجريبي
        $parent = User::firstOrCreate(
            ['email' => 'parent@test.com'],
            [
                'name' => 'أحمد محمد',
                'password' => Hash::make('password123'),
                'role' => 3, // parent
            ]
        );

        echo "✅ Parent user created: {$parent->email}\n";

        // 2. الحصول على مدارس موجودة أو إنشاء مدارس تجريبية
        $schools = School::take(3)->get();
        
        if ($schools->count() < 3) {
            echo "⚠️  Creating sample schools...\n";
            
            $schoolsData = [
                [
                    'name' => 'مدرسة النجاح الجديدة',
                    'english_name' => 'Al-Najah New School',
                    'address' => 'شارع الجامعة، مدينة نابلس',
                    'region' => 'الضفة الغربية',
                    'city' => 'نابلس',
                    'directorate' => 'نابلس',
                    'type' => 'private',
                    'school_type' => 'mixed',
                    'level' => 'all',
                    'rating' => 4.8,
                    'reviews_count' => 125,
                    'students_count' => 450,
                    'teachers_count' => 35,
                    'is_active' => true,
                ],
                [
                    'name' => 'مدرسة الأمل الابتدائية',
                    'english_name' => 'Al-Amal Primary School',
                    'address' => 'حي الشيخ جراح، القدس',
                    'region' => 'القدس',
                    'city' => 'القدس',
                    'directorate' => 'القدس',
                    'type' => 'public',
                    'school_type' => 'boys',
                    'level' => 'primary',
                    'rating' => 4.5,
                    'reviews_count' => 89,
                    'students_count' => 320,
                    'teachers_count' => 28,
                    'is_active' => true,
                ],
                [
                    'name' => 'مدرسة التميز الثانوية',
                    'english_name' => 'Excellence High School',
                    'address' => 'شارع المنارة، رام الله',
                    'region' => 'الضفة الغربية',
                    'city' => 'رام الله',
                    'directorate' => 'رام الله والبيرة',
                    'type' => 'private',
                    'school_type' => 'girls',
                    'level' => 'secondary',
                    'rating' => 4.9,
                    'reviews_count' => 156,
                    'students_count' => 280,
                    'teachers_count' => 32,
                    'is_active' => true,
                ],
            ];

            foreach ($schoolsData as $schoolData) {
                $schools[] = School::create($schoolData);
            }
            
            echo "✅ Sample schools created\n";
        }

        // 3. إنشاء سجلات للأبناء
        $childrenData = [
            [
                'child_name' => 'محمد أحمد',
                'child_grade' => 'الصف السادس',
                'child_section' => 'أ',
                'status' => 'active',
            ],
            [
                'child_name' => 'فاطمة أحمد',
                'child_grade' => 'الصف الثالث',
                'child_section' => 'ب',
                'status' => 'active',
            ],
            [
                'child_name' => 'عمر أحمد',
                'child_grade' => 'الصف العاشر',
                'child_section' => 'ج',
                'status' => 'active',
            ],
        ];

        foreach ($childrenData as $index => $childData) {
            if (isset($schools[$index])) {
                ParentChild::firstOrCreate(
                    [
                        'parent_id' => $parent->user_id,
                        'child_name' => $childData['child_name'],
                    ],
                    [
                        'school_id' => $schools[$index]->school_id,
                        'child_grade' => $childData['child_grade'],
                        'child_section' => $childData['child_section'],
                        'status' => $childData['status'],
                        'enrollment_date' => now()->subMonths(rand(1, 12)),
                    ]
                );
            }
        }

        echo "✅ Parent children records created\n";

        // 4. إنشاء إشعارات تجريبية
        $notificationsData = [
            [
                'title' => 'تم تحديث تقييم مدرستك',
                'message' => 'تم تحديث تقييم مدرسة النجاح الجديدة. التقييم الجديد: 4.8 نجوم',
                'type' => 'info',
                'related_school_id' => $schools[0]->school_id ?? null,
            ],
            [
                'title' => 'موعد اجتماع أولياء الأمور',
                'message' => 'يسرنا دعوتكم لحضور اجتماع أولياء الأمور يوم الخميس القادم الساعة 4 مساءً',
                'type' => 'warning',
                'related_school_id' => $schools[1]->school_id ?? null,
            ],
            [
                'title' => 'نتائج الامتحانات متاحة',
                'message' => 'تم نشر نتائج امتحانات الفصل الأول. يمكنكم الاطلاع عليها من خلال حسابكم',
                'type' => 'success',
                'related_school_id' => $schools[0]->school_id ?? null,
            ],
            [
                'title' => 'تنبيه: رسوم مدرسية',
                'message' => 'يرجى تسديد الرسوم المدرسية للفصل الثاني قبل نهاية الأسبوع',
                'type' => 'alert',
                'related_school_id' => $schools[2]->school_id ?? null,
            ],
            [
                'title' => 'مبروك! تفوق ابنكم',
                'message' => 'نهنئكم بحصول ابنكم محمد على المركز الأول في مسابقة الرياضيات',
                'type' => 'success',
                'related_school_id' => $schools[0]->school_id ?? null,
            ],
        ];

        foreach ($notificationsData as $notificationData) {
            ParentNotification::create([
                'user_id' => $parent->user_id,
                'title' => $notificationData['title'],
                'message' => $notificationData['message'],
                'type' => $notificationData['type'],
                'related_school_id' => $notificationData['related_school_id'],
                'is_read' => rand(0, 1) == 1, // بعض الإشعارات مقروءة
                'created_at' => now()->subDays(rand(0, 7)),
            ]);
        }

        echo "✅ Parent notifications created\n";

        echo "\n";
        echo "═══════════════════════════════════════════════════\n";
        echo "✅ Parent Dashboard Seeder completed successfully!\n";
        echo "═══════════════════════════════════════════════════\n";
        echo "📧 Test Parent Email: parent@test.com\n";
        echo "🔑 Password: password123\n";
        echo "═══════════════════════════════════════════════════\n";
    }
}
