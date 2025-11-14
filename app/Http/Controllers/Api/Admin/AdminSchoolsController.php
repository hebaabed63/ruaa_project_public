<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\School;
use App\Models\User;

class AdminSchoolsController extends Controller
{
    /**
     * Get all schools with filtering and pagination
     */
    public function getSchools(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مسؤول
            if ($user->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $query = School::query();
            
            // تطبيق الفلاتر إذا كانت موجودة
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }
            
            // ترتيب النتائج
            $query->orderBy('created_at', 'desc');
            
            // تطبيق الترقيم
            $schools = $query->paginate(10);
            
            // تحويل أنواع المدارس إلى نصوص عربية
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $schools->getCollection()->transform(function ($school) use ($typeMapping) {
                $school->type_name = $typeMapping[$school->type] ?? $school->type;
                return $school;
            });
            
            return response()->json([
                'success' => true,
                'data' => $schools,
                'message' => 'تم جلب المدارس بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المدارس: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get school details
     */
    public function getSchoolDetails(Request $request, $schoolId)
    {
        try {
            $admin = $request->user();
            
            // التحقق من أن المستخدم مسؤول
            if ($admin->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $school = School::find($schoolId);
            
            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة'
                ], 404);
            }
            
            // تحويل النوع إلى نص عربي
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type_name = $typeMapping[$school->type] ?? $school->type;
            
            // جلب مدير المدرسة إذا كان موجوداً
            if ($school->manager_id) {
                $manager = User::find($school->manager_id);
                $school->manager = $manager ? [
                    'id' => $manager->user_id,
                    'name' => $manager->name,
                    'email' => $manager->email
                ] : null;
            }
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم جلب تفاصيل المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new school
     */
    public function createSchool(Request $request)
    {
        try {
            $admin = $request->user();
            
            // التحقق من أن المستخدم مسؤول
            if ($admin->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'type' => 'required|in:primary,preparatory,secondary',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'website' => 'nullable|string|max:255',
                'description' => 'nullable|string'
            ]);
            
            $school = School::create($validatedData);
            
            // تحويل النوع إلى نص عربي
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type_name = $typeMapping[$school->type] ?? $school->type;
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم إنشاء المدرسة بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update school
     */
    public function updateSchool(Request $request, $schoolId)
    {
        try {
            $admin = $request->user();
            
            // التحقق من أن المستخدم مسؤول
            if ($admin->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $school = School::find($schoolId);
            
            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'address' => 'sometimes|required|string|max:500',
                'type' => 'sometimes|required|in:primary,preparatory,secondary',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'website' => 'nullable|string|max:255',
                'description' => 'nullable|string'
            ]);
            
            $school->update($validatedData);
            
            // تحويل النوع إلى نص عربي
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type_name = $typeMapping[$school->type] ?? $school->type;
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم تحديث المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete school
     */
    public function deleteSchool(Request $request, $schoolId)
    {
        try {
            $admin = $request->user();
            
            // التحقق من أن المستخدم مسؤول
            if ($admin->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $school = School::find($schoolId);
            
            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة'
                ], 404);
            }
            
            // التحقق من عدم وجود مستخدمين مرتبطين بالمدرسة
            $hasUsers = User::where('school_id', $schoolId)->exists();
            
            if ($hasUsers) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف المدرسة لأنها تحتوي على مستخدمين مرتبطين'
                ], 400);
            }
            
            $school->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
}