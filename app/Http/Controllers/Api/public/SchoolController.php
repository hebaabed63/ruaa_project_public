<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SchoolController extends Controller
{
    // عرض جميع المدارس
    public function index(Request $request)
    {
        try {
            $query = School::query();
            
            // البحث بالاسم
            if ($request->has('search') && !empty($request->search)) {
                $query->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('address', 'like', '%' . $request->search . '%');
            }
            
            // التصفية حسب النوع (ابتدائي، متوسط، ثانوي)
            if ($request->has('type') && !empty($request->type)) {
                // Map Arabic type values to English for database query
                $typeMapping = [
                    'ابتدائي' => 'primary',
                    'متوسط' => 'preparatory',
                    'ثانوي' => 'secondary'
                ];
                
                $englishType = $typeMapping[$request->type] ?? $request->type;
                $query->where('type', $englishType);
            }
            
            // الترتيب
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);
            
            // التصفح مع التقسيم
            $perPage = $request->get('per_page', 15);
            $schools = $query->paginate($perPage);
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            // Transform the data to use Arabic type values
            $schools->getCollection()->transform(function ($school) use ($typeMapping) {
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
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب قائمة المدارس: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // عرض تفاصيل مدرسة واحدة
    public function show($id)
    {
        try {
            $school = School::with(['ratings', 'complaints'])->findOrFail($id);
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type = $typeMapping[$school->type] ?? $school->type;
            
            // حساب متوسط التقييم
            $averageRating = $school->ratings()->avg('rating') ?? 0;
            $totalRatings = $school->ratings()->count();
            
            // إحصائيات إضافية
            $school->average_rating = round($averageRating, 1);
            $school->total_ratings = $totalRatings;
            $school->complaints_count = $school->complaints()->count();
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم جلب تفاصيل المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'المدرسة غير موجودة'
            ], 404);
        }
    }
    
    // إنشاء مدرسة جديدة (للأدمين فقط)
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string',
                'type' => 'required|string|in:primary,preparatory,secondary',
                // Removed fields that don't exist in the current schema
            ]);
            
            $schoolData = [
                'name' => $validated['name'],
                'address' => $validated['address'],
                'type' => $validated['type']  // Store English values as expected by the database
            ];
            
            $school = School::create($schoolData);
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type = $typeMapping[$school->type] ?? $school->type;
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم إنشاء المدرسة بنجاح'
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // تحديث بيانات المدرسة
    public function update(Request $request, $id)
    {
        try {
            $school = School::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'address' => 'sometimes|required|string',
                'type' => 'sometimes|required|string|in:primary,preparatory,secondary',
                // Removed fields that don't exist in the current schema
            ]);
            
            $updateData = [];
            if (isset($validated['name'])) {
                $updateData['name'] = $validated['name'];
            }
            if (isset($validated['address'])) {
                $updateData['address'] = $validated['address'];
            }
            if (isset($validated['type'])) {
                $updateData['type'] = $validated['type'];  // Store English values as expected by the database
            }
            
            $school->update($updateData);
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $school->type = $typeMapping[$school->type] ?? $school->type;
            
            return response()->json([
                'success' => true,
                'data' => $school->fresh(),
                'message' => 'تم تحديث بيانات المدرسة بنجاح'
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // حذف المدرسة (للأدمين فقط)
    public function destroy($id)
    {
        try {
            $school = School::findOrFail($id);
            $school->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف المدرسة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // إحصائيات المدارس
    public function statistics()
    {
        try {
            $totalSchools = School::count();
            
            // Get schools by type and map English to Arabic
            $schoolsByType = School::selectRaw('type, COUNT(*) as count')
                                   ->groupBy('type')
                                   ->get();
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $schoolsByType->transform(function ($item) use ($typeMapping) {
                $item->type = $typeMapping[$item->type] ?? $item->type;
                return $item;
            });
            
            // We don't have region column, so we'll skip schools_by_region
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_schools' => $totalSchools,
                    'schools_by_type' => $schoolsByType,
                    // Removed schools_by_region since we don't have that column
                ],
                'message' => 'تم جلب إحصائيات المدارس بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }
}