<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    public function run()
    {
        $schools = [
            [
                'name' => 'مدرسة ذكور رام الله الثانوية',
                'address' => 'رام الله - دوار المنارة',
                'type' => 'secondary',
                'certifications' => json_encode([
                    'مدرسة صديقة للطفل',
                    'معتمدة من وزارة التربية والتعليم'
                ]),
                'achievements' => json_encode([
                    'المركز الأول في مسابقة الروبوتات 2023',
                    'أعلى نسبة نجاح في الثانوية العامة 2023'
                ])
            ],
            [
                'name' => 'مدرسة بنات نابلس الإعدادية',
                'address' => 'نابلس - حي الصباح',
                'type' => 'preparatory',
                'certifications' => json_encode([
                    'مدرسة خضراء',
                    'معتمدة من وزارة التربية والتعليم'
                ]),
                'achievements' => json_encode([
                    'جائزة التميز في التعليم 2023',
                    'أفضل مشروع بيئي على مستوى المحافظة'
                ])
            ],
            [
                'name' => 'مدرسة خليل السكاكيني الأساسية',
                'address' => 'الخليل - حي الشيخ',
                'type' => 'primary',
                'certifications' => json_encode([
                    'مدرسة صديقة للطفل',
                    'معتمدة من وزارة التربية والتعليم'
                ]),
                'achievements' => json_encode([
                    'أفضل أداء في القراءة للصفوف الأساسية',
                    'جائزة المعلم المتميز 2023'
                ])
            ]
        ];

        foreach ($schools as $school) {
            School::create($school);
        }
    }
}
