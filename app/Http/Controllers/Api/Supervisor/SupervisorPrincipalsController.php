<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Notification;

class SupervisorPrincipalsController extends Controller
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
     * GET /api/supervisor/principals/pending
     * جلب طلبات مدراء المدارس المعلقة
     */
    public function getPendingPrincipals(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $pendingPrincipals = User::where('role', 2)
                ->where('status', 'pending')
                ->where('supervisor_id', $user->user_id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pendingPrincipals
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الطلبات المعلقة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/principals/{userId}/approve
     * الموافقة على طلب مدير مدرسة
     */
    public function approvePendingPrincipal(Request $request, $userId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $principal = User::where('user_id', $userId)
                ->where('role', 2)
                ->where('supervisor_id', $user->user_id)
                ->first();

            if (!$principal) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            $principal->status = 'active';
            $principal->save();

            Notification::create([
                'user_id' => $userId,
                'type' => 'account_approved',
                'title' => 'تمت الموافقة على حسابك',
                'content' => 'تمت الموافقة على حسابك كمدير مدرسة',
                'link' => '/dashboard/principal'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على الطلب بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الموافقة على الطلب: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/principals/{userId}/reject
     * رفض طلب مدير مدرسة
     */
    public function rejectPendingPrincipal(Request $request, $userId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $principal = User::where('user_id', $userId)
                ->where('role', 2)
                ->where('supervisor_id', $user->user_id)
                ->first();

            if (!$principal) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            $principal->status = 'rejected';
            $principal->save();

            Notification::create([
                'user_id' => $userId,
                'type' => 'account_rejected',
                'title' => 'تم رفض حسابك',
                'content' => 'تم رفض طلب التسجيل كمدير مدرسة',
                'link' => null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفض الطلب بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في رفض الطلب: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/principals/active
     * جلب مدراء المدارس النشطين
     */
    public function getActivePrincipals(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $activePrincipals = User::where('role', 2)
                ->where('status', 'active')
                ->where('supervisor_id', $user->user_id)
                ->with('school')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $activePrincipals
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب مدراء المدارس النشطين'
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/principals/statistics
     * إحصائيات مدراء المدارس
     */
    public function getPrincipalsStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $totalPrincipals = User::where('role', 2)
                ->where('supervisor_id', $user->user_id)
                ->count();

            $activePrincipals = User::where('role', 2)
                ->where('status', 'active')
                ->where('supervisor_id', $user->user_id)
                ->count();

            $pendingPrincipals = User::where('role', 2)
                ->where('status', 'pending')
                ->where('supervisor_id', $user->user_id)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $totalPrincipals,
                    'active' => $activePrincipals,
                    'pending' => $pendingPrincipals
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إحصائيات مدراء المدارس'
            ], 500);
        }
    }
}