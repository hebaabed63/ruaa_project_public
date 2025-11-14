<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Report;
use App\Models\School;

class SupervisorReportsController extends Controller
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
     * GET /api/supervisor/reports
     * جلب جميع تقارير المشرف
     */
    public function getSupervisorReports(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $reports = Report::where('supervisor_id', $user->user_id)
                ->with(['school', 'reviewer'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reports,
                'message' => 'تم جلب قائمة التقارير بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب قائمة التقارير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/reports
     * إنشاء تقرير جديد
     */
    public function createReport(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $validatedData = $request->validate([
                'school_id' => 'nullable|exists:schools,school_id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
                'priority' => 'nullable|in:low,medium,high,urgent',
                'status' => 'nullable|in:draft,submitted'
            ]);

            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('reports', 'public');
            }

            $report = Report::create([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'] ?? null,
                'title' => $validatedData['title'],
                'description' => $validatedData['description'] ?? null,
                'file_path' => $filePath,
                'priority' => $validatedData['priority'] ?? 'medium',
                'status' => $validatedData['status'] ?? 'draft'
            ]);

            if ($report->status === 'submitted') {
                $report->submitted_at = now();
                $report->save();
            }

            return response()->json([
                'success' => true,
                'data' => $report->load(['school', 'reviewer']),
                'message' => 'تم إنشاء التقرير بنجاح'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء التقرير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/reports/{reportId}
     * جلب تفاصيل تقرير محدد
     */
    public function getReportDetails(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $report = Report::where('supervisor_id', $user->user_id)
                ->where('report_id', $reportId)
                ->with(['school', 'reviewer'])
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $report,
                'message' => 'تم جلب تفاصيل التقرير بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل التقرير'
            ], 500);
        }
    }

    /**
     * PUT /api/supervisor/reports/{reportId}
     * تحديث تقرير
     */
    public function updateReport(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $report = Report::where('supervisor_id', $user->user_id)
                ->where('report_id', $reportId)
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            $validatedData = $request->validate([
                'school_id' => 'nullable|exists:schools,school_id',
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
                'priority' => 'nullable|in:low,medium,high,urgent',
                'status' => 'nullable|in:draft,submitted'
            ]);

            $report->fill($validatedData);

            if ($request->hasFile('file')) {
                if ($report->file_path && Storage::exists('public/' . $report->file_path)) {
                    Storage::delete('public/' . $report->file_path);
                }
                $filePath = $request->file('file')->store('reports', 'public');
                $report->file_path = $filePath;
            }

            if (isset($validatedData['status']) && $validatedData['status'] === 'submitted' && $report->status !== 'submitted') {
                $report->submitted_at = now();
            }

            $report->save();

            return response()->json([
                'success' => true,
                'data' => $report->load(['school', 'reviewer']),
                'message' => 'تم تحديث التقرير بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث التقرير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/supervisor/reports/{reportId}
     * حذف تقرير
     */
    public function deleteReport(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $report = Report::where('supervisor_id', $user->user_id)
                ->where('report_id', $reportId)
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            if ($report->file_path && Storage::exists('public/' . $report->file_path)) {
                Storage::delete('public/' . $report->file_path);
            }

            $report->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف التقرير بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف التقرير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/reports/statistics
     * إحصائيات التقارير
     */
    public function getReportsStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $totalReports = Report::where('supervisor_id', $user->user_id)->count();
            $draftReports = Report::where('supervisor_id', $user->user_id)->where('status', 'draft')->count();
            $submittedReports = Report::where('supervisor_id', $user->user_id)->where('status', 'submitted')->count();
            $reviewedReports = Report::where('supervisor_id', $user->user_id)->where('status', 'reviewed')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $totalReports,
                    'draft' => $draftReports,
                    'submitted' => $submittedReports,
                    'reviewed' => $reviewedReports
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إحصائيات التقارير'
            ], 500);
        }
    }
}