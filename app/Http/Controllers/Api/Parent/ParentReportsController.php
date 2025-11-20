<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentReport;
use App\Models\ParentChild;
use App\Models\Report;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ParentReportsController extends Controller
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
     * Get student reports for parent's children
     * GET /api/parent/reports
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Validate request
            $validator = Validator::make($request->all(), [
                'child_id' => 'required|integer',
                'term' => 'required|string|max:50',
            ], [
                'child_id.required' => 'معرف الطفل مطلوب',
                'child_id.integer' => 'معرف الطفل يجب أن يكون رقماً',
                'term.required' => 'الفصل الدراسي مطلوب',
                'term.max' => 'الفصل الدراسي يجب ألا يتجاوز 50 حرف',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صحيحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $childId = $request->child_id;
            $term = $request->term;

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
                'message' => 'تم جلب تقرير الطالب بنجاح',
                'data' => [
                    'report_id' => $report->id,
                    'student_id' => $report->student_id,
                    'student_name' => $parentChild->child_name,
                    'term' => $report->term,
                    'academic_year' => $report->academic_year,
                    'summary' => $report->summary ?? [],
                    'attendance' => $report->attendance ?? [],
                    'grades' => $report->grades ?? [],
                    'behavior' => $report->behavior ?? [],
                    'activities' => $report->activities ?? [],
                    'teacher_comments' => $report->teacher_comments ?? [],
                    'principal_comments' => $report->principal_comments ?? [],
                    'overall_performance' => $report->overall_performance ?? 'جيد',
                    'created_at' => $report->created_at->toISOString(),
                    'updated_at' => $report->updated_at->toISOString(),
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Parent Reports Error: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التقارير',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get available reports for parent's children
     * GET /api/parent/reports/available
     */
    public function getAvailableReports(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Get all active children for the parent
            $children = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->with(['school:school_id,name'])
                ->get(['child_id', 'child_name', 'child_grade', 'school_id']);

            $availableReports = [];

            foreach ($children as $child) {
                // Get available terms for this child
                $terms = StudentReport::where('student_id', $child->child_id)
                    ->distinct()
                    ->pluck('term')
                    ->map(function ($term) use ($child) {
                        return [
                            'term' => $term,
                            'child_id' => $child->child_id,
                            'child_name' => $child->child_name,
                            'grade' => $child->child_grade,
                            'school_name' => $child->school->name ?? 'غير محدد',
                        ];
                    });

                $availableReports = array_merge($availableReports, $terms->toArray());
            }

            // Get distinct academic years
            $academicYears = StudentReport::whereIn('student_id', $children->pluck('child_id'))
                ->distinct()
                ->pluck('academic_year')
                ->filter()
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب التقارير المتاحة بنجاح',
                'data' => [
                    'available_reports' => $availableReports,
                    'academic_years' => $academicYears,
                    'total_children' => $children->count(),
                    'total_reports' => count($availableReports),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Available Reports Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التقارير المتاحة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get report summary for dashboard
     * GET /api/parent/reports/summary
     */
    public function getReportsSummary(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Get all active children
            $children = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->get(['child_id', 'child_name', 'child_grade']);

            $summary = [
                'total_children' => $children->count(),
                'children_with_reports' => 0,
                'recent_reports' => [],
                'performance_overview' => [],
            ];

            foreach ($children as $child) {
                // Get the most recent report for each child
                $recentReport = StudentReport::where('student_id', $child->child_id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($recentReport) {
                    $summary['children_with_reports']++;
                    
                    $summary['recent_reports'][] = [
                        'child_id' => $child->child_id,
                        'child_name' => $child->child_name,
                        'grade' => $child->child_grade,
                        'term' => $recentReport->term,
                        'academic_year' => $recentReport->academic_year,
                        'overall_performance' => $recentReport->overall_performance ?? 'غير محدد',
                        'report_date' => $recentReport->created_at->toISOString(),
                    ];

                    // Performance overview
                    $performance = $recentReport->overall_performance ?? 'جيد';
                    if (!isset($summary['performance_overview'][$performance])) {
                        $summary['performance_overview'][$performance] = 0;
                    }
                    $summary['performance_overview'][$performance]++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'تم جلب ملخص التقارير بنجاح',
                'data' => $summary
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Reports Summary Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب ملخص التقارير',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Download report as PDF
     * GET /api/parent/reports/{id}/download
     */
    public function downloadReport(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $report = StudentReport::findOrFail($reportId);

            // Verify that the report belongs to one of the parent's children
            $childExists = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $report->student_id)
                ->where('status', 'active')
                ->exists();

            if (!$childExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بتنزيل هذا التقرير'
                ], 403);
            }

            // Here you would typically generate a PDF
            // For now, return the report data with download info
            return response()->json([
                'success' => true,
                'message' => 'سيتم تنزيل التقرير قريباً',
                'data' => [
                    'report_id' => $report->id,
                    'download_url' => null, // You would generate this URL
                    'file_name' => "report_{$report->student_id}_{$report->term}.pdf",
                    'file_size' => null,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Download Report Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحضير التقرير للتنزيل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}