<?php

namespace App\Http\Controllers;

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
                      ->orWhere('location', 'like', '%' . $request->search . '%');
            }
            
            // التصفية حسب النوع (ابتدائي، متوسط، ثانوي)
            if ($request->has('type') && !empty($request->type)) {
                $query->where('type', $request->type);
            }
            
            // التصفية حسب المنطقة
            if ($request->has('region') && !empty($request->region)) {
                $query->where('region', $request->region);
            }
            
            // الترتيب
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);
            
            // التصفح مع التقسيم
            $perPage = $request->get('per_page', 15);
            $schools = $query->paginate($perPage);
            
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
                'location' => 'required|string|max:255',
                'type' => 'required|string|in:ابتدائي,متوسط,ثانوي',
                'region' => 'required|string|max:100',
                'capacity' => 'required|integer|min:1',
                'description' => 'nullable|string',
                'contact_phone' => 'nullable|string|max:20',
                'contact_email' => 'nullable|email|max:255',
                'established_year' => 'nullable|integer|min:1900|max:2024'
            ]);
            
            $school = School::create($validated);
            
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
                'location' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|string|in:ابتدائي,متوسط,ثانوي',
                'region' => 'sometimes|required|string|max:100',
                'capacity' => 'sometimes|required|integer|min:1',
                'description' => 'nullable|string',
                'contact_phone' => 'nullable|string|max:20',
                'contact_email' => 'nullable|email|max:255',
                'established_year' => 'nullable|integer|min:1900|max:2024'
            ]);
            
            $school->update($validated);
            
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
            $schoolsByType = School::selectRaw('type, COUNT(*) as count')
                                   ->groupBy('type')
                                   ->get();
            $schoolsByRegion = School::selectRaw('region, COUNT(*) as count')
                                     ->groupBy('region')
                                     ->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_schools' => $totalSchools,
                    'schools_by_type' => $schoolsByType,
                    'schools_by_region' => $schoolsByRegion
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
