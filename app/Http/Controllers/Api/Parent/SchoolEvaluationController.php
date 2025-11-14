<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Criterion;
use App\Models\Evaluation;
use App\Models\EvaluationCriterion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\SchoolEvaluation;

class SchoolEvaluationController extends Controller
{
    /**
     * GET /api/parent/evaluation-criteria
     * يرجّع قائمة المعايير لنبني السلايدرز على الواجهة
     */
    public function getCriteria(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || (int)$user->role !== 3) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }

            $criteria = Criterion::orderBy('criterion_id')->get()->map(function ($c) {
                // أيقونة/لون افتراضيين (يمكنك لاحقًا قراءتهما من أعمدة بالجدول إن وُجدت)
                $name = mb_strtolower($c->name);
                $icon = 'FaStar';
                if (str_contains($name, 'المنهاج') || str_contains($name, 'منهج') || str_contains($name, 'curric')) {
                    $icon = 'FaGraduationCap';
                } elseif (str_contains($name, 'معلم')) {
                    $icon = 'FaUsers';
                } elseif (str_contains($name, 'بيئة') || str_contains($name, 'مرافق')) {
                    $icon = 'FaSchool';
                } elseif (str_contains($name, 'امتحان') || str_contains($name, 'تقويم') || str_contains($name, 'اختبار')) {
                    $icon = 'FaTrophy';
                } elseif (str_contains($name, 'نشاط') || str_contains($name, 'لامنهج')) {
                    $icon = 'FaTrophy';
                } elseif (str_contains($name, 'تواصل') || str_contains($name, 'أولياء')) {
                    $icon = 'FaComments';
                } elseif (str_contains($name, 'سلامة') || str_contains($name, 'أمن')) {
                    $icon = 'FaUsers';
                } elseif (str_contains($name, 'دامج') || str_contains($name, 'دمج') || str_contains($name, 'احتياجات')) {
                    $icon = 'FaUsers';
                }

                $color = match ($icon) {
                    'FaGraduationCap' => 'from-indigo-500 to-indigo-600',
                    'FaSchool'        => 'from-blue-500 to-blue-600',
                    'FaUsers'         => 'from-purple-500 to-purple-600',
                    'FaComments'      => 'from-orange-500 to-orange-600',
                    'FaTrophy'        => 'from-yellow-500 to-yellow-600',
                    default           => 'from-indigo-500 to-indigo-600',
                };

                return [
                    'id'          => (int) $c->criterion_id,
                    'name'        => $c->name,
                    'description' => $c->description,
                    'icon'        => $icon,
                    'color'       => $color,
                    'max_rating'  => 5,
                ];
            });

            return response()->json([
                'success' => true,
                'data'    => $criteria,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching evaluation criteria: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch evaluation criteria.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * GET /api/parent/schools/{schoolId}/evaluation
     * تفاصيل المدرسة + إحصائيات + متوسطات المعايير + تقييم المستخدم (إن وُجد)
     */
    public function getSchoolEvaluation(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            if (!$user || (int)$user->role !== 3) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }

            $school = School::where('school_id', $schoolId)->first();
            if (!$school) {
                return response()->json(['success' => false, 'message' => 'School not found.'], 404);
            }

            // IDs لكل تقييمات هذه المدرسة
            $allEvalIds = Evaluation::where('school_id', $schoolId)->pluck('evaluation_id');

            // المتوسط العام (على مستوى جميع العناصر)
            $overall = DB::table('evaluation_criteria')
                ->whereIn('evaluation_id', $allEvalIds)
                ->selectRaw('AVG(score) as avg_score, COUNT(*) as items_count')
                ->first();

            $criteria = Criterion::orderBy('criterion_id')->get();

            // متوسط كل معيار
            $perCriterion = DB::table('evaluation_criteria')
                ->whereIn('evaluation_id', $allEvalIds)
                ->select('criterion_id', DB::raw('AVG(score) as avg_score'))
                ->groupBy('criterion_id')
                ->pluck('avg_score', 'criterion_id');

            // آخر تقييم لنفس ولي الأمر (إن وُجد)
            $userEvaluation = Evaluation::where('school_id', $schoolId)
                ->where('parent_id', $user->user_id)
                ->latest('date')
                ->first();

            $userCriteriaRatings = [];
            if ($userEvaluation) {
                $userCriteriaRatings = EvaluationCriterion::where('evaluation_id', $userEvaluation->evaluation_id)
                    ->get(['criterion_id', 'score'])
                    ->map(fn ($i) => ['criterion_id' => (int) $i->criterion_id, 'rating' => (float) $i->score])
                    ->values();
            }

            // تجهيز مخرجات المعايير مع الأيقونات/الألوان
            $criteriaOut = $criteria->map(function ($c) use ($perCriterion) {
                $name = mb_strtolower($c->name);
                $icon = 'FaStar';
                if (str_contains($name, 'منهاج') || str_contains($name, 'منهج') || str_contains($name, 'curric')) {
                    $icon = 'FaGraduationCap';
                } elseif (str_contains($name, 'معلم')) {
                    $icon = 'FaUsers';
                } elseif (str_contains($name, 'بيئة') || str_contains($name, 'مرافق')) {
                    $icon = 'FaSchool';
                } elseif (str_contains($name, 'امتحان') || str_contains($name, 'تقويم') || str_contains($name, 'اختبار')) {
                    $icon = 'FaTrophy';
                } elseif (str_contains($name, 'نشاط') || str_contains($name, 'لامنهج')) {
                    $icon = 'FaTrophy';
                } elseif (str_contains($name, 'تواصل') || str_contains($name, 'أولياء')) {
                    $icon = 'FaComments';
                } elseif (str_contains($name, 'سلامة') || str_contains($name, 'أمن')) {
                    $icon = 'FaUsers';
                } elseif (str_contains($name, 'دامج') || str_contains($name, 'دمج') || str_contains($name, 'احتياجات')) {
                    $icon = 'FaUsers';
                }

                $color = match ($icon) {
                    'FaGraduationCap' => 'from-indigo-500 to-indigo-600',
                    'FaSchool'        => 'from-blue-500 to-blue-600',
                    'FaUsers'         => 'from-purple-500 to-purple-600',
                    'FaComments'      => 'from-orange-500 to-orange-600',
                    'FaTrophy'        => 'from-yellow-500 to-yellow-600',
                    default           => 'from-indigo-500 to-indigo-600',
                };

                return [
                    'id'             => (int) $c->criterion_id,
                    'name'           => $c->name,
                    'description'    => $c->description,
                    'icon'           => $icon,
                    'color'          => $color,
                    'average_rating' => round((float) ($perCriterion[$c->criterion_id] ?? 0), 1),
                    'max_rating'     => 5,
                ];
            });

            return response()->json([
                'success' => true,
                'data'    => [
                    'school' => [
                        'id'      => (int) $school->school_id,
                        'name'    => $school->name ?? $school->school_name,
                        'type'    => $school->type ?? $school->school_type,
                        'city'    => $school->city,
                        'region'  => $school->region,
                        'address' => $school->address,
                        'logo'    => $school->logo ?? $school->cover_image,
                    ],
                    'statistics' => [
                        'overall_rating'          => round((float) ($overall->avg_score ?? 0), 1),
                        'total_ratings'           => (int) ($overall->items_count ?? 0),
                        'excellent_count'         => null,
                        'good_count'              => null,
                        'needs_improvement_count' => null,
                    ],
                    'criteria'    => $criteriaOut,
                    'user_rating' => $userEvaluation ? [
                        'id'               => (int) $userEvaluation->evaluation_id,
                        'rating'           => round((float) (collect($userCriteriaRatings)->avg('rating') ?? 0), 1),
                        'comment'          => $userEvaluation->comment,
                        'criteria_ratings' => $userCriteriaRatings,
                        'created_at'       => $userEvaluation->created_at,
                    ] : null,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching school evaluation: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'school_id' => $schoolId,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch school evaluation.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * POST /api/parent/schools/{schoolId}/evaluation
     * Submit school evaluation with criteria ratings
     */
    public function submitEvaluation(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            if (!$user || (int)$user->role !== 3) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }

            // Validate that school exists
            $school = School::where('school_id', $schoolId)->first();
            if (!$school) {
                return response()->json(['success' => false, 'message' => 'School not found.'], 404);
            }

            // التحقق من البيانات
            $validator = Validator::make($request->all(), [
                'criteria'                => 'required|array|min:1',
                'criteria.*.criterion_id' => 'required|exists:criteria,criterion_id',
                'criteria.*.score'        => 'required|numeric|min:1|max:5',
                'comment'                 => 'nullable|string|max:1000',
                'date'                    => 'nullable|date',
            ], [
                'criteria.required' => 'يجب تقديم معايير التقييم',
                'criteria.array' => 'معايير التقييم يجب أن تكون في صيغة مصفوفة',
                'criteria.min' => 'يجب تقديم معيار تقييم واحد على الأقل',
                'criteria.*.criterion_id.required' => 'معرف المعيار مطلوب',
                'criteria.*.criterion_id.exists' => 'المعيار المحدد غير موجود',
                'criteria.*.score.required' => 'تقييم المعيار مطلوب',
                'criteria.*.score.numeric' => 'تقييم المعيار يجب أن يكون رقماً',
                'criteria.*.score.min' => 'تقييم المعيار يجب ألا يقل عن 1',
                'criteria.*.score.max' => 'تقييم المعيار يجب ألا يزيد عن 5',
                'comment.max' => 'التعليق يجب ألا يزيد عن 1000 حرف',
                'date.date' => 'صيغة التاريخ غير صحيحة',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $date = $request->input('date') ?: now()->toDateString();
            $criteria = collect($request->criteria);

            DB::beginTransaction();

            // إذا نفس الشخص قيّم نفس المدرسة، يحدث التقييم
            $evaluation = Evaluation::updateOrCreate(
                [
                    'school_id'   => (int) $schoolId,
                    'parent_id'   => (int) $user->user_id,
                ],
                [
                    'supervisor_id' => null, // حسب الحاجة
                    'date'          => $date,
                    'comment'       => $request->input('comment'),
                ]
            );

            // حذف المعايير القديمة للتقييم قبل إدخال الجديدة
            EvaluationCriterion::where('evaluation_id', $evaluation->evaluation_id)->delete();

            // إدخال كل معيار جديد
            $evaluationRows = $criteria->map(function ($item) use ($evaluation) {
                return [
                    'evaluation_id' => $evaluation->evaluation_id,
                    'criterion_id'  => (int) $item['criterion_id'],
                    'score'         => round((float) $item['score'], 1),
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            })->all();

            EvaluationCriterion::insert($evaluationRows);

            DB::commit();

            // Calculate average rating
            $averageRating = $criteria->avg('score');

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ التقييم بنجاح.',
                'data'    => [
                    'evaluation_id' => $evaluation->evaluation_id,
                    'school_id'     => $schoolId,
                    'parent_id'     => $user->user_id,
                    'date'          => $date,
                    'comment'       => $request->input('comment'),
                    'average_rating' => round((float) $averageRating, 1),
                    'criteria'      => $criteria,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error submitting school evaluation: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'school_id' => $schoolId,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save evaluation.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}