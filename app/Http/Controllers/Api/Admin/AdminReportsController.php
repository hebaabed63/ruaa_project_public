<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Report;
use App\Models\School;
use App\Models\User;

class AdminReportsController extends Controller
{
    /**
     * Get all reports with filtering and pagination
     */
    public function getReports(Request $request)
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
            
            $query = Report::with(['school', 'reviewer']);
            
            // تطبيق الفلاتر إذا كانت موجودة
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }
            
            if ($request->has('school_id')) {
                $query->where('school_id', $request->school_id);
            }
            
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            
            // ترتيب النتائج
            $query->orderBy('created_at', 'desc');
            
            // تطبيق الترقيم
            $reports = $query->paginate(10);
            
            // تحويل الأولويات والحالات إلى نصوص عربية
            $priorityMapping = [
                'low' => 'منخفضة',
                'medium' => 'متوسطة',
                'high' => 'عالية',
                'urgent' => 'عاجلة'
            ];
            
            $statusMapping = [
                'draft' => 'مسودة',
                'submitted' => 'مقدم',
                'reviewed' => 'مراجعة',
                'approved' => 'موافق عليه',
                'rejected' => 'مرفوض'
            ];
            
            $reports->getCollection()->transform(function ($report) use ($priorityMapping, $statusMapping) {
                $report->priority_name = $priorityMapping[$report->priority] ?? $report->priority;
                $report->status_name = $statusMapping[$report->status] ?? $report->status;
                return $report;
            });
            
            return response()->json([
                'success' => true,
                'data' => $reports,
                'message' => 'تم جلب التقارير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب التقارير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get report details
     */
    public function getReportDetails(Request $request, $reportId)
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
            
            $report = Report::with(['school', 'reviewer'])->find($reportId);
            
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود'
                ], 404);
            }
            
            // تحويل الأولويات والحالات إلى نصوص عربية
            $priorityMapping = [
                'low' => 'منخفضة',
                'medium' => 'متوسطة',
                'high' => 'عالية',
                'urgent' => 'عاجلة'
            ];
            
            $statusMapping = [
                'draft' => 'مسودة',
                'submitted' => 'مقدم',
                'reviewed' => 'مراجعة',
                'approved' => 'موافق عليه',
                'rejected' => 'مرفوض'
            ];
            
            $report->priority_name = $priorityMapping[$report->priority] ?? $report->priority;
            $report->status_name = $statusMapping[$report->status] ?? $report->status;
            
            // إضافة رابط الملف إذا كان موجوداً
            if ($report->file_path) {
                $report->file_url = asset('storage/' . $report->file_path);
            }
            
            return response()->json([
                'success' => true,
                'data' => $report,
                'message' => 'تم جلب تفاصيل التقرير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل التقرير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update report status
     */
    public function updateReportStatus(Request $request, $reportId)
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
            
            $report = Report::find($reportId);
            
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'status' => 'required|in:draft,submitted,reviewed,approved,rejected',
                'review_notes' => 'nullable|string'
            ]);
            
            $report->status = $validatedData['status'];
            if (isset($validatedData['review_notes'])) {
                $report->review_notes = $validatedData['review_notes'];
            }
            
            if ($validatedData['status'] === 'reviewed' && !$report->reviewed_at) {
                $report->reviewed_at = now();
                $report->reviewer_id = $admin->user_id;
            }
            
            $report->save();
            
            // تحويل الحالة إلى نص عربي
            $statusMapping = [
                'draft' => 'مسودة',
                'submitted' => 'مقدم',
                'reviewed' => 'مراجعة',
                'approved' => 'موافق عليه',
                'rejected' => 'مرفوض'
            ];
            
            $report->status_name = $statusMapping[$report->status] ?? $report->status;
            
            return response()->json([
                'success' => true,
                'data' => $report,
                'message' => 'تم تحديث حالة التقرير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث حالة التقرير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete report
     */
    public function deleteReport(Request $request, $reportId)
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
            
            $report = Report::find($reportId);
            
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود'
                ], 404);
            }
            
            // حذف الملف إذا كان موجوداً
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
}