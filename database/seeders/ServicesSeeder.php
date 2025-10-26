<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'تقييم شامل للمدارس',
                'description' => 'نوفر تقييماً دقيقاً وشاملاً للمدارس بناءً على معايير تربوية وأكاديمية متقدمة',
                'icon' => 'star',
                'features' => [
                    'تقييم البيئة التعليمية',
                    'تقييم الكادر التدريسي',
                    'تقييم المرافق والخدمات',
                    'تقييم الأنشطة اللامنهجية'
                ],
                'order' => 1,
                'is_active' => true
            ],
            [
                'title' => 'مقارنة المدارس',
                'description' => 'أداة تفاعلية لمقارنة المدارس المختلفة ومساعدة أولياء الأمور في اتخاذ القرار الصحيح',
                'icon' => 'compare',
                'features' => [
                    'مقارنة التقييمات',
                    'مقارنة الرسوم الدراسية',
                    'مقارنة المناهج',
                    'مقارنة الأنشطة'
                ],
                'order' => 2,
                'is_active' => true
            ],
            [
                'title' => 'آراء أولياء الأمور',
                'description' => 'منصة تفاعلية لمشاركة تجارب وآراء أولياء الأمور حول المدارس',
                'icon' => 'users',
                'features' => [
                    'تقييمات معتمدة',
                    'تعليقات موثوقة',
                    'تجارب حقيقية',
                    'نظام تصويت شفاف'
                ],
                'order' => 3,
                'is_active' => true
            ],
            [
                'title' => 'بحث متقدم',
                'description' => 'محرك بحث قوي للعثور على المدرسة المثالية بناءً على معايير محددة',
                'icon' => 'search',
                'features' => [
                    'بحث بالموقع',
                    'بحث بالتخصص',
                    'بحث بالرسوم',
                    'فلاتر متعددة'
                ],
                'order' => 4,
                'is_active' => true
            ],
            [
                'title' => 'تقارير مفصلة',
                'description' => 'تقارير تحليلية شاملة عن أداء المدارس والاتجاهات التعليمية',
                'icon' => 'report',
                'features' => [
                    'تقارير سنوية',
                    'إحصائيات مفصلة',
                    'تحليلات بيانية',
                    'توصيات تطويرية'
                ],
                'order' => 5,
                'is_active' => true
            ],
            [
                'title' => 'استشارات تعليمية',
                'description' => 'خدمة استشارية لمساعدة أولياء الأمور في اختيار المدرسة المناسبة',
                'icon' => 'consultation',
                'features' => [
                    'استشارات مجانية',
                    'خبراء تربويون',
                    'توجيه شخصي',
                    'متابعة مستمرة'
                ],
                'order' => 6,
                'is_active' => true
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
