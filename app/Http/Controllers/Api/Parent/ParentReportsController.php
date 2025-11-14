<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentReport;
use App\Models\ParentChild;

class ParentReportsController extends Controller
{
    /**
     * Get student reports for parent's children
     * GET /api/parent/reports?child_id=3&term=2024-2025-1
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            // Verify user is a parent (role = 3)
            if ($user->role !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بالوصول لهذه الصفحة'
                ], 403);
            }

            // Validate request
            $validated = $request->validate([
                'child_id' => 'required|integer',
                'term' => 'required|string',
            ]);

            $childId = $validated['child_id'];
            $term = $validated['term'];

            // Verify this child belongs to the current parent
            $parentChild = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $childId)
                ->where('status', 'active')
                ->first();

            if (!$parentChild) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذا الطفل غير مرتبط بحسابك'
                ], 403);
            }

            // Get the student report
            $report = StudentReport::where('student_id', $childId)
                ->where('term', $term)
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد تقارير لهذا الطالب في هذا الفصل الدراسي'
                ], 404);
            }

            // Return the report data
            return response()->json([
                'success' => true,
                'message' => 'تم جلب تقارير الطالب',
                'data' => [
                    'summary' => $report->summary ?? [],
                    'attendance' => $report->attendance ?? [],
                    'activity' => $report->activity ?? [],
                    'grades' => $report->grades ?? [],
                    'homeworks' => $report->homeworks ?? [],
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Parent Reports Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التقارير',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}
