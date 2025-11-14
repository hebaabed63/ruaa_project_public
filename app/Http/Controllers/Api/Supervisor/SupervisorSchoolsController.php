<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\School;
use App\Models\Notification;

class SupervisorSchoolsController extends Controller
{
    /**
     * التحقق من أن المستخدم مشرف
     */
    private function ensureSupervisor($user)
    {
        if (($user->role ?? null) !== 1) {
            abort(response()->json([
                'success' => false,
                'message' => 'غير مسموح لك بالوصول لهذه البيانات'
            ], 403));
        }
    }

    /**
     * GET /api/supervisor/schools
     * جلب المدارس التي يشرف عليها المشرف
     */
    public function getSupervisorSchools(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            if (!Schema::hasTable('supervisor_school')) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'لا توجد مدارس مرتبطة بحسابك حالياً'
                ]);
            }

            $schools = DB::table('supervisor_school')
                ->join('schools', 'supervisor_school.school_id', '=', 'schools.school_id')
                ->where('supervisor_school.supervisor_id', $user->user_id)
                ->select(
                    'schools.school_id',
                    'schools.name',
                    DB::raw("COALESCE(schools.address, '') as address"),
                    'schools.type',
                    'schools.created_at'
                )
                ->get();

            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];

            $schools->transform(function ($school) use ($typeMapping) {
                $school->type = $typeMapping[$school->type] ?? $school->type;
                return $school;
            });

            return response()->json([
                'success' => true,
                'data' => $schools,
                'message' => 'تم جلب قائمة المدارس بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'لا توجد مدارس مرتبطة بحسابك حالياً'
            ]);
        }
    }

    /**
     * POST /api/supervisor/schools
     * إضافة مدرسة جديدة للإشراف
     */
    public function addSchoolToSupervision(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $validatedData = $request->validate([
                'school_id' => 'required|exists:schools,school_id',
            ]);

            $exists = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->where('school_id', $validatedData['school_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذه المدرسة مربوطة بك مسبقاً'
                ], 409);
            }

            DB::table('supervisor_school')->insert([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $school = School::find($validatedData['school_id']);

            Notification::create([
                'user_id' => $user->user_id,
                'type' => 'school_added',
                'title' => 'تمت إضافة مدرسة جديدة',
                'content' => 'تم إضافة مدرسة ' . $school->name . ' إلى قائمة المدارس التي تشرف عليها',
                'link' => '/dashboard/supervisor/schools',
            ]);

            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تمت إضافة المدرسة بنجاح إلى قائمة الإشراف'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/supervisor/schools/{schoolId}
     * إزالة مدرسة من قائمة الإشراف
     */
    public function removeSchoolFromSupervision(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $deleted = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->where('school_id', $schoolId)
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة في قائمة الإشراف'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم إزالة المدرسة من قائمة الإشراف بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إزالة المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/schools/available
     * جلب المدارس المتاحة للإضافة
     */
    public function getAvailableSchools(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $existingSchoolIds = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->pluck('school_id');

            $availableSchools = School::whereNotIn('school_id', $existingSchoolIds)
                ->select('school_id', 'name', 'type', 'address')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $availableSchools,
                'message' => 'تم جلب المدارس المتاحة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المدارس المتاحة'
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/schools/{schoolId}/details
     * تفاصيل مدرسة محددة
     */
    public function getSchoolDetails(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $school = DB::table('supervisor_school')
                ->join('schools', 'supervisor_school.school_id', '=', 'schools.school_id')
                ->where('supervisor_school.supervisor_id', $user->user_id)
                ->where('schools.school_id', $schoolId)
                ->select('schools.*')
                ->first();

            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم جلب تفاصيل المدرسة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل المدرسة'
            ], 500);
        }
    }
}