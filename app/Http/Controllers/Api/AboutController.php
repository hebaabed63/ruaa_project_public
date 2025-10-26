<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    /**
     * Get About page data
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $about = About::where('is_active', true)->first();

            if (!$about) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد بيانات متاحة',
                ], 404);
            }

            $data = [
                'pageInfo' => [
                    'title' => 'عن المنصّة',
                    'lastUpdated' => $about->updated_at->toISOString(),
                    'description' => 'منصة رؤى للتقييم التعليمي في فلسطين'
                ],
                'goalVision' => [
                    'goal' => [
                        'title' => $about->goal_title,
                        'content' => $about->goal_content
                    ],
                    'vision' => [
                        'title' => $about->vision_title,
                        'content' => $about->vision_content
                    ]
                ],
                'values' => $about->values,
                'story' => [
                    'title' => $about->story_title,
                    'paragraphs' => $about->story_paragraphs
                ],
                'statistics' => $about->statistics,
                'partners' => $about->partners,
                'developmentPlan' => $about->development_plan
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
