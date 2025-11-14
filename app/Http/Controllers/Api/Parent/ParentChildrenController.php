<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ParentChild;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ParentChildrenController extends Controller
{
    /**
     * Ensure the authenticated user is a parent (role = 3)
     */
    private function ensureParent($user)
    {
        if (($user->role ?? null) !== 3) {
            abort(response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول لهذه الصفحة'
            ], 403));
        }
    }

    /**
     * Get all children for the parent
     * GET /api/parent/children
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $children = ParentChild::where('parent_id', $user->user_id)
                ->with(['school' => function($query) {
                    $query->select('school_id', 'name', 'type', 'level', 'address', 'city', 'region', 'logo');
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($child) {
                    return [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'section' => $child->child_section,
                        'birth_date' => $child->birth_date,
                        'gender' => $child->gender,
                        'national_id' => $child->national_id,
                        'status' => $child->status,
                        'school' => $child->school ? [
                            'id' => $child->school->school_id,
                            'name' => $child->school->name,
                            'type' => $child->school->type,
                            'level' => $child->school->level,
                            'address' => $child->school->address,
                            'city' => $child->school->city,
                            'region' => $child->school->region,
                            'logo' => $child->school->logo,
                        ] : null,
                        'created_at' => $child->created_at->toISOString(),
                        'updated_at' => $child->updated_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'تم جلب بيانات الأبناء بنجاح',
                'data' => [
                    'children' => $children,
                    'total' => $children->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Children Index Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب بيانات الأبناء',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get specific child details
     * GET /api/parent/children/{id}
     */
    public function show(Request $request, $childId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $child = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $childId)
                ->with(['school' => function($query) {
                    $query->select('school_id', 'name', 'type', 'level', 'address', 'city', 'region', 'logo', 'phone', 'email');
                }])
                ->firstOrFail();

            // Get child's recent reports count
            $reportsCount = DB::table('student_reports')
                ->where('student_id', $childId)
                ->count();

            // Get child's school rating if exists
            $schoolRating = DB::table('school_ratings')
                ->where('school_id', $child->school_id)
                ->where('user_id', $user->user_id)
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب بيانات الطفل بنجاح',
                'data' => [
                    'child' => [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'section' => $child->child_section,
                        'birth_date' => $child->birth_date,
                        'gender' => $child->gender,
                        'national_id' => $child->national_id,
                        'status' => $child->status,
                        'enrollment_date' => $child->enrollment_date,
                        'school' => $child->school ? [
                            'id' => $child->school->school_id,
                            'name' => $child->school->name,
                            'type' => $child->school->type,
                            'level' => $child->school->level,
                            'address' => $child->school->address,
                            'city' => $child->school->city,
                            'region' => $child->school->region,
                            'logo' => $child->school->logo,
                            'phone' => $child->school->phone,
                            'email' => $child->school->email,
                        ] : null,
                        'statistics' => [
                            'reports_count' => $reportsCount,
                            'has_rating' => !is_null($schoolRating),
                            'rating_value' => $schoolRating->rating ?? null,
                        ],
                        'created_at' => $child->created_at->toISOString(),
                        'updated_at' => $child->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Child Show Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب بيانات الطفل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Add a new child
     * POST /api/parent/children
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'child_name' => 'required|string|max:100',
                'child_grade' => 'required|string|max:50',
                'child_section' => 'nullable|string|max:50',
                'birth_date' => 'nullable|date',
                'gender' => 'required|in:male,female',
                'national_id' => 'nullable|string|max:20',
                'school_id' => 'required|exists:schools,school_id',
                'enrollment_date' => 'nullable|date',
            ], [
                'child_name.required' => 'اسم الطفل مطلوب',
                'child_name.max' => 'اسم الطفل يجب ألا يتجاوز 100 حرف',
                'child_grade.required' => 'الصف الدراسي مطلوب',
                'child_grade.max' => 'الصف الدراسي يجب ألا يتجاوز 50 حرف',
                'gender.required' => 'الجنس مطلوب',
                'gender.in' => 'الجنس يجب أن يكون ذكر أو أنثى',
                'school_id.required' => 'المدرسة مطلوبة',
                'school_id.exists' => 'المدرسة غير موجودة',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check if child already exists for this parent
            $existingChild = ParentChild::where('parent_id', $user->user_id)
                ->where('child_name', $request->child_name)
                ->where('school_id', $request->school_id)
                ->first();

            if ($existingChild) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذا الطفل مسجل already في هذه المدرسة'
                ], 422);
            }

            $child = ParentChild::create([
                'parent_id' => $user->user_id,
                'child_name' => $request->child_name,
                'child_grade' => $request->child_grade,
                'child_section' => $request->child_section,
                'birth_date' => $request->birth_date,
                'gender' => $request->gender,
                'national_id' => $request->national_id,
                'school_id' => $request->school_id,
                'enrollment_date' => $request->enrollment_date,
                'status' => 'active',
            ]);

            // Load school relationship for response
            $child->load('school:school_id,name');

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الطفل بنجاح',
                'data' => [
                    'child' => [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'section' => $child->child_section,
                        'school' => $child->school ? [
                            'id' => $child->school->school_id,
                            'name' => $child->school->name,
                        ] : null,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Parent Child Store Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الطفل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update child information
     * PUT /api/parent/children/{id}
     */
    public function update(Request $request, $childId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $child = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $childId)
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'child_name' => 'sometimes|string|max:100',
                'child_grade' => 'sometimes|string|max:50',
                'child_section' => 'nullable|string|max:50',
                'birth_date' => 'nullable|date',
                'gender' => 'sometimes|in:male,female',
                'national_id' => 'nullable|string|max:20',
                'school_id' => 'sometimes|exists:schools,school_id',
                'enrollment_date' => 'nullable|date',
                'status' => 'sometimes|in:active,inactive,transferred',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $child->update($request->all());

            // Load school relationship for response
            $child->load('school:school_id,name');

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث بيانات الطفل بنجاح',
                'data' => [
                    'child' => [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'section' => $child->child_section,
                        'school' => $child->school ? [
                            'id' => $child->school->school_id,
                            'name' => $child->school->name,
                        ] : null,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Child Update Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث بيانات الطفل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove a child
     * DELETE /api/parent/children/{id}
     */
    public function destroy(Request $request, $childId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $child = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $childId)
                ->firstOrFail();

            // Instead of deleting, we can set status to inactive
            $child->update(['status' => 'inactive']);

            // Or if you want to actually delete:
            // $child->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الطفل بنجاح'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Child Delete Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الطفل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get children statistics
     * GET /api/parent/children/statistics
     */
    public function getStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $totalChildren = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->count();

            $childrenByGender = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->select('gender', DB::raw('count(*) as count'))
                ->groupBy('gender')
                ->pluck('count', 'gender');

            $childrenBySchool = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->with('school:school_id,name')
                ->get()
                ->groupBy('school_id')
                ->map(function ($children, $schoolId) {
                    $school = $children->first()->school;
                    return [
                        'school_id' => $schoolId,
                        'school_name' => $school->name ?? 'غير محدد',
                        'children_count' => $children->count(),
                    ];
                })
                ->values();

            $recentlyAdded = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->with('school:school_id,name')
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($child) {
                    return [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'school_name' => $child->school->name ?? 'غير محدد',
                        'added_date' => $child->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'تم جلب إحصائيات الأبناء بنجاح',
                'data' => [
                    'total_children' => $totalChildren,
                    'gender_distribution' => [
                        'male' => $childrenByGender['male'] ?? 0,
                        'female' => $childrenByGender['female'] ?? 0,
                    ],
                    'school_distribution' => $childrenBySchool,
                    'recently_added' => $recentlyAdded,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Children Statistics Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب إحصائيات الأبناء',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}