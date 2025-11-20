<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\User;

class AdminComplaintsController extends Controller
{
    /**
     * Get all complaints (for admin)
     */
    public function getAllComplaints(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لشكاوي المستخدمين'
                ], 403);
            }

            $complaints = Complaint::with('user')->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $complaints,
                'message' => 'تم جلب الشكاوي بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الشكاوي: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get complaint by ID (for admin)
     */
    public function getComplaintById(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه الشكوى'
                ], 403);
            }

            $complaint = Complaint::with('user')->find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'تم جلب الشكوى بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update complaint status (for admin)
     */
    public function updateComplaintStatus(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة الشكوى'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,resolved,closed'
            ]);

            $complaint = Complaint::find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            $complaint->status = $validated['status'];
            $complaint->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الشكوى بنجاح',
                'data' => $complaint
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete complaint (for admin)
     */
    public function deleteComplaint(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف الشكوى'
                ], 403);
            }

            $complaint = Complaint::find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            $complaint->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشكوى بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * Get complaints statistics (for admin)
 */
public function getComplaintsStats(Request $request)
{
    try {
        if ($request->user()->role !== 0) {
            return response()->json([
                'success' => false,
                'message' => 'غير مسموح لك بالوصول لهذه البيانات'
            ], 403);
        }

        $stats = [
            'totalComplaints' => Complaint::count(),
            'openComplaints' => Complaint::where('status', 'open')->count(),
            'inProgressComplaints' => Complaint::where('status', 'in_progress')->count(),
            'resolvedComplaints' => Complaint::where('status', 'resolved')->count(),
            'closedComplaints' => Complaint::where('status', 'closed')->count(),
            'technicalComplaints' => Complaint::where('complaint_type', 'technical')->count(),
            'serviceComplaints' => Complaint::where('complaint_type', 'service')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'تم جلب إحصائيات الشكاوى بنجاح'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
        ], 500);
    }
}
}