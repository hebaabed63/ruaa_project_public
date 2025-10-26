<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class SchoolController extends Controller
{
    /**
     * Get all schools with pagination and filters
     * GET /api/schools
     */
    
    public function index(Request $request): JsonResponse
    {
         try {
            $perPage = $request->get('limit', 10);
            $sortBy  = $request->get('sortBy', 'created_at');
            $order   = $request->get('order', 'desc');

            $schools = School::query()
                ->active()
                ->filter($request)   // 👈 كل الفلاتر هنا
                ->orderBy($sortBy, $order)
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools->items(),
                    'total' => $schools->total(),
                    'current_page' => $schools->currentPage(),
                    'last_page' => $schools->lastPage(),
                    'per_page' => $schools->perPage(),
                ],
                'message' => 'تم جلب المدارس بنجاح',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المدارس',
                'error' => $e->getMessage(),
            ], 500);
        }
    
       
    }

    /**
     * Get a single school by ID
     * GET /api/schools/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $school = School::where('school_id', $id)
                           ->active()
                           ->first();

            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تم جلب بيانات المدرسة بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب بيانات المدرسة',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get best schools (highest rating)
     * GET /api/schools/best
     */
    public function best(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);
            $schools = School::best($limit)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools,
                    'total' => $schools->count(),
                ],
                'message' => 'تم جلب أفضل المدارس بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب أفضل المدارس',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get schools by region
     * GET /api/schools/by-region
     */
    public function byRegion(Request $request): JsonResponse
    {
        try {
            $region = $request->get('region');
            
            if (!$region) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب تحديد المنطقة',
                ], 400);
            }

            $schools = School::active()
                            ->byRegion($region)
                            ->orderBy('rating', 'desc')
                            ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools,
                    'total' => $schools->count(),
                    'region' => $region,
                ],
                'message' => 'تم جلب المدارس حسب المنطقة بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المدارس',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recently added schools
     * GET /api/schools/recent
     */
    public function recent(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 6);
            $schools = School::recent($limit)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools,
                    'total' => $schools->count(),
                ],
                'message' => 'تم جلب المدارس المضافة حديثاً بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المدارس',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search schools
     * GET /api/schools/search
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = School::query()->active();

            // Search by query string
            if ($request->has('q') && $request->q) {
                $query->search($request->q);
            }

            // Apply filters
            if ($request->has('region') && $request->region) {
                $query->byRegion($request->region);
            }

            if ($request->has('type') && $request->type) {
                $query->bySchoolType($request->type);
            }

            if ($request->has('level') && $request->level) {
                $query->byLevel($request->level);
            }

            if ($request->has('minRating') && $request->minRating) {
                $query->minRating($request->minRating);
            }

            // Pagination
            $perPage = $request->get('limit', 10);
            $schools = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools->items(),
                    'total' => $schools->total(),
                    'current_page' => $schools->currentPage(),
                    'last_page' => $schools->lastPage(),
                ],
                'message' => 'تم البحث بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء البحث',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get regions list with school count
     * GET /api/schools/regions
     */
    public function regions(): JsonResponse
    {
        try {
            $regions = School::active()
                            ->select('region')
                            ->selectRaw('COUNT(*) as school_count')
                            ->groupBy('region')
                            ->get();

            return response()->json([
                'success' => true,
                'data' => $regions,
                'message' => 'تم جلب قائمة المناطق بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المناطق',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics
     * GET /api/statistics/general
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_schools' => School::active()->count(),
                'total_regions' => School::active()->distinct('region')->count('region'),
                'total_directorates' => School::active()->distinct('directorate')->count('directorate'),
                'total_students' => School::active()->sum('students_count'),
                'total_teachers' => School::active()->sum('teachers_count'),
                'average_rating' => round(School::active()->avg('rating'), 2),
                'schools_by_type' => School::active()
                    ->select('school_type')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('school_type')
                    ->get(),
                'schools_by_region' => School::active()
                    ->select('region')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('region')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب الإحصائيات بنجاح',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
