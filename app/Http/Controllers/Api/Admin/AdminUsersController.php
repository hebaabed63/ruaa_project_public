<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\SupportTicket;
use App\Models\Complaint;

class AdminUsersController extends Controller
{
    /**
     * Get all users (for admin)
     */
    public function getAllUsers(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // جلب المستخدمين مع إمكانية التصفية
            $query = User::query();

            // تصفية حسب الدور إذا تم تحديده
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // تصفية حسب الحالة إذا تم تحديدها
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // ترتيب النتائج
            $users = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'تم جلب المستخدمين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المستخدمين: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending users (for admin)
     */
    public function getPendingUsers(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $pendingUsers = User::where('status', 'pending')->get();

            // Add warning message for approvers
            $warningMessage = 'البريد لم يتم التحقق من وجوده فعليًا، تأكد من صحته قبل القبول.';

            return response()->json([
                'success' => true,
                'data' => $pendingUsers,
                'warning' => $warningMessage,
                'message' => 'تم جلب المستخدمين المعلقين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المستخدمين المعلقين: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على المشرفين المعلقين
     */
    public function getPendingSupervisors(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $pendingUsers = DB::table('users')
                ->where('role', 1) // مشرفين
                ->where('status', 'pending') // معلقين
                ->select('user_id', 'name', 'email', 'organization_name', 'created_at')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pendingUsers,
                'message' => 'تم جلب المشرفين المعلقين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب البيانات'
            ], 500);
        }
    }

    /**
     * الموافقة على مشرف
     */
    public function approveSupervisor(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالموافقة على المشرفين'
                ], 403);
            }

            DB::table('users')
                ->where('user_id', $userId)
                ->where('role', 1)
                ->update(['status' => 'active']);

            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على المشرف بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الموافقة على المشرف'
            ], 500);
        }
    }

    /**
     * رفض مشرف
     */
    public function rejectSupervisor(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك برفض المشرفين'
                ], 403);
            }

            DB::table('users')
                ->where('user_id', $userId)
                ->where('role', 1)
                ->delete(); // أو update(['status' => 'rejected'])

            return response()->json([
                'success' => true,
                'message' => 'تم رفض المشرف بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في رفض المشرف'
            ], 500);
        }
    }

    /**
     * Approve pending user (for admin)
     */
    public function approvePendingUser(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالموافقة على المستخدمين'
                ], 403);
            }

            // البحث عن المستخدم المعلق
            $user = User::where('user_id', $userId)
                ->where('status', 'pending')
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود أو حالته ليست معلق'
                ], 404);
            }

            // تحديث حالة المستخدم إلى نشط
            $user->status = 'active';
            $user->save();

            // إرسال إيميل إشعار بالموافقة
            try {
                \Mail::to($user->email)->send(new \App\Mail\AccountApprovedNotification($user));
            } catch (\Exception $e) {
                \Log::error('Failed to send approval email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء الموافقة على المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject pending user (for admin)
     */
    public function rejectPendingUser(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك برفض المستخدمين'
                ], 403);
            }

            // البحث عن المستخدم المعلق
            $user = User::where('user_id', $userId)
                ->where('status', 'pending')
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود أو حالته ليست معلق'
                ], 404);
            }

            // تحديث حالة المستخدم إلى مرفوض
            $user->status = 'rejected';
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تم رفض المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفض المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user status (for admin)
     */
    public function updateUserStatus(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة المستخدمين'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:active,suspended'
            ]);

            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            $user->status = $validated['status'];
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }
}