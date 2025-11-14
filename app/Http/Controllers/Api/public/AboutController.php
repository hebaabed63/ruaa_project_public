<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class AboutController extends Controller
{
    /**
     * Get about page content
     */
    public function index()
    {
        try {
            // Get about page settings from database
            $about = Setting::where('key', 'about')->first();
            $mission = Setting::where('key', 'mission')->first();
            $vision = Setting::where('key', 'vision')->first();
            $values = Setting::where('key', 'values')->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'about' => $about ? $about->value : 'منصة رؤى التعليمية - منصة شاملة لتقييم وإدارة المدارس',
                    'mission' => $mission ? $mission->value : 'توفير منصة موثوقة وشفافة لتقييم المدارس',
                    'vision' => $vision ? $vision->value : 'أن نكون المرجع الأول في تقييم التعليم',
                    'values' => $values ? json_decode($values->value, true) : [
                        'الشفافية',
                        'المصداقية',
                        'الجودة',
                        'التطوير المستمر'
                    ]
                ],
                'message' => 'تم جلب البيانات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Get team members
     */
    public function team()
    {
        try {
            $team = Setting::where('key', 'team')->first();
            
            $teamData = $team ? json_decode($team->value, true) : [
                [
                    'name' => 'د. محمد أحمد',
                    'position' => 'المدير التنفيذي',
                    'image' => null,
                    'bio' => 'خبرة 15 عاماً في مجال التعليم'
                ],
                [
                    'name' => 'أ. فاطمة علي',
                    'position' => 'مديرة العمليات',
                    'image' => null,
                    'bio' => 'متخصصة في إدارة المشاريع التعليمية'
                ]
            ];
            
            return response()->json([
                'success' => true,
                'data' => $teamData,
                'message' => 'تم جلب البيانات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}
