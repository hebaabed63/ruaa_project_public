<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolRating;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    /**
     * Store a new rating
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'school_id' => 'required|exists:schools,id',
                'parent_name' => 'required|string|max:255',
                'rating' => 'required|numeric|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                'criteria' => 'nullable|array',
            ], [
                'school_id.required' => 'معرّف المدرسة مطلوب',
                'school_id.exists' => 'المدرسة غير موجودة',
                'parent_name.required' => 'اسم ولي الأمر مطلوب',
                'rating.required' => 'التقييم مطلوب',
                'rating.min' => 'التقييم يجب أن يكون على الأقل 1',
                'rating.max' => 'التقييم يجب ألا يزيد عن 5',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صالحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rating = SchoolRating::create([
                'school_id' => $request->school_id,
                'user_id' => auth()->id(),
                'parent_name' => $request->parent_name,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'criteria' => $request->criteria,
                'is_approved' => false // Needs admin approval
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال تقييمك بنجاح. سيتم مراجعته قريباً',
                'data' => $rating
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال التقييم',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get ratings for a school
     * 
     * @param int $schoolId
     * @return JsonResponse
     */
    public function getSchoolRatings($schoolId): JsonResponse
    {
        try {
            $school = School::findOrFail($schoolId);
            
            $ratings = SchoolRating::where('school_id', $schoolId)
                ->approved()
                ->latest()
                ->paginate(10);

            $data = [
                'school' => [
                    'id' => $school->id,
                    'name' => $school->name,
                    'averageRating' => $school->rating
                ],
                'ratings' => $ratings->map(function($rating) {
                    return [
                        'id' => $rating->id,
                        'parentName' => $rating->parent_name,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'criteria' => $rating->criteria,
                        'createdAt' => $rating->created_at->format('Y-m-d')
                    ];
                }),
                'pagination' => [
                    'currentPage' => $ratings->currentPage(),
                    'lastPage' => $ratings->lastPage(),
                    'perPage' => $ratings->perPage(),
                    'total' => $ratings->total()
                ]
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

    /**
     * Get evaluation criteria
     * 
     * @return JsonResponse
     */
    public function getEvaluationCriteria(): JsonResponse
    {
        try {
            $criteria = [
                [
                    'id' => 1,
                    'name' => 'جودة التعليم',
                    'description' => 'مستوى التدريس والمناهج',
                    'icon' => 'book'
                ],
                [
                    'id' => 2,
                    'name' => 'البيئة المدرسية',
                    'description' => 'نظافة وسلامة المرافق',
                    'icon' => 'building'
                ],
                [
                    'id' => 3,
                    'name' => 'الأنشطة اللامنهجية',
                    'description' => 'الأنشطة الرياضية والثقافية',
                    'icon' => 'users'
                ],
                [
                    'id' => 4,
                    'name' => 'التواصل مع أولياء الأمور',
                    'description' => 'مستوى التواصل والتفاعل',
                    'icon' => 'message'
                ],
                [
                    'id' => 5,
                    'name' => 'الكادر التدريسي',
                    'description' => 'كفاءة وخبرة المعلمين',
                    'icon' => 'award'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $criteria
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
