<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evaluation;
use App\Models\Criterion;
use App\Models\School;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    /**
     * Get evaluation criteria
     */
    public function getEvaluationCriteria()
    {
        try {
            $criteria = Criterion::where('active', true)
                ->orderBy('order', 'asc')
                ->get(['criterion_id', 'name_ar as name', 'description', 'weight', 'order']);
            
            return response()->json([
                'success' => true,
                'data' => $criteria,
                'message' => 'تم جلب معايير التقييم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب معايير التقييم',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Get school ratings
     */
    public function getSchoolRatings($schoolId)
    {
        try {
            $school = School::findOrFail($schoolId);
            
            // Get all evaluations for this school
            $evaluations = Evaluation::where('school_id', $schoolId)
                ->with(['user:user_id,name', 'criteria'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);
            
            // Calculate average ratings
            $averageRating = Evaluation::where('school_id', $schoolId)
                ->avg('overall_rating') ?? 0;
            
            $totalRatings = Evaluation::where('school_id', $schoolId)->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'school' => [
                        'id' => $school->school_id,
                        'name' => $school->name,
                        'averageRating' => round($averageRating, 1),
                        'totalRatings' => $totalRatings
                    ],
                    'evaluations' => $evaluations
                ],
                'message' => 'تم جلب تقييمات المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التقييمات',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Submit rating (requires authentication)
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب تسجيل الدخول لتقييم المدارس'
                ], 401);
            }
            
            $validator = Validator::make($request->all(), [
                'school_id' => 'required|exists:schools,school_id',
                'overall_rating' => 'required|numeric|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                'criteria' => 'nullable|array',
                'criteria.*.criterion_id' => 'required|exists:criteria,criterion_id',
                'criteria.*.rating' => 'required|numeric|min:1|max:5',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في البيانات المدخلة',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Check if user already rated this school
            $existingRating = Evaluation::where('school_id', $request->school_id)
                ->where('user_id', $user->user_id)
                ->first();
            
            if ($existingRating) {
                return response()->json([
                    'success' => false,
                    'message' => 'لقد قمت بتقييم هذه المدرسة مسبقاً'
                ], 400);
            }
            
            DB::beginTransaction();
            
            try {
                // Create evaluation
                $evaluation = Evaluation::create([
                    'school_id' => $request->school_id,
                    'user_id' => $user->user_id,
                    'overall_rating' => $request->overall_rating,
                    'comment' => $request->comment,
                    'status' => 'approved'
                ]);
                
                // Attach criteria ratings
                if ($request->has('criteria')) {
                    foreach ($request->criteria as $criterion) {
                        $evaluation->criteria()->attach($criterion['criterion_id'], [
                            'rating' => $criterion['rating']
                        ]);
                    }
                }
                
                // Update school average rating
                $this->updateSchoolRating($request->school_id);
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'data' => $evaluation->load('criteria'),
                    'message' => 'تم إرسال تقييمك بنجاح'
                ], 201);
                
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال التقييم',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Update school average rating
     */
    private function updateSchoolRating($schoolId)
    {
        $averageRating = Evaluation::where('school_id', $schoolId)
            ->where('status', 'approved')
            ->avg('overall_rating');
        
        $reviewsCount = Evaluation::where('school_id', $schoolId)
            ->where('status', 'approved')
            ->count();
        
        School::where('school_id', $schoolId)->update([
            'rating' => round($averageRating, 1),
            'reviews_count' => $reviewsCount
        ]);
    }
}
