<?php

namespace Database\Seeders;

use App\Models\Criterion;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    public function run()
    {
        $criteria = [
            [
                'name' => 'جودة المنهاج الدراسي',
                'description' => 'مدى ملاءمة المنهاج الدراسي واحتوائه على المهارات والمعارف المطلوبة',
            ],
            [
                'name' => 'كفاءة المعلمين',
                'description' => 'مستوى تأهيل وكفاءة الهيئة التدريسية',
            ],
            [
                'name' => 'البيئة التعليمية',
                'description' => 'مدى ملاءمة البيئة الصفية والمرافق المدرسية',
            ],
            [
                'name' => 'التقويم والامتحانات',
                'description' => 'نظام التقويم ومدى موضوعيته وشموليته',
            ],
            [
                'name' => 'الأنشطة اللامنهجية',
                'description' => 'تنوع البرامج والأنشطة اللاصفية',
            ],
            [
                'name' => 'التواصل مع أولياء الأمور',
                'description' => 'فعالية قنوات التواصل بين المدرسة وأولياء الأمور',
            ],
            [
                'name' => 'السلامة المدرسية',
                'description' => 'تدابير الأمن والسلامة المتبعة في المدرسة',
            ],
            [
                'name' => 'التعليم الدامج',
                'description' => 'مدى دمج الطلبة ذوي الاحتياجات الخاصة',
            ]
        ];

        foreach ($criteria as $criterion) {
            Criterion::create($criterion);
        }
    }
}
