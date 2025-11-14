<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SupervisorInvitation;
use App\Models\School;

class SupervisorInvitationsController extends Controller
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
     * GET /api/supervisor/invitations
     * جلب جميع دعوات المشرف
     */
    public function getSupervisorInvitations(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $invitations = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->with('school')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $invitations,
                'message' => 'تم جلب قائمة الدعوات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب قائمة الدعوات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/invitations
     * إنشاء دعوة جديدة
     */
    public function createSupervisorInvitation(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $validatedData = $request->validate([
                'school_id' => 'required|exists:schools,school_id',
                'invitee_name' => 'required|string|max:255',
                'invitee_email' => 'required|email|unique:supervisor_invitations,invitee_email,NULL,invitation_id,supervisor_id,' . $user->user_id,
                'message' => 'nullable|string',
                'expires_in_days' => 'nullable|integer|min:1|max:365'
            ]);

            $token = uniqid('inv_' . time() . '_', true);
            $expiresAt = now()->addDays($validatedData['expires_in_days'] ?? 30);

            $invitation = SupervisorInvitation::create([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'],
                'invitee_name' => $validatedData['invitee_name'],
                'invitee_email' => $validatedData['invitee_email'],
                'token' => $token,
                'message' => $validatedData['message'] ?? null,
                'expires_at' => $expiresAt
            ]);

            return response()->json([
                'success' => true,
                'data' => $invitation->load('school'),
                'message' => 'تم إنشاء الدعوة بنجاح'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/supervisor/invitations/{invitationId}
     * تحديث دعوة
     */
    public function updateSupervisorInvitation(Request $request, $invitationId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $invitation = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->where('invitation_id', $invitationId)
                ->first();

            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }

            $validatedData = $request->validate([
                'status' => 'sometimes|required|in:pending,accepted,rejected,expired',
                'message' => 'nullable|string'
            ]);

            $invitation->fill($validatedData);
            $invitation->save();

            return response()->json([
                'success' => true,
                'data' => $invitation->load('school'),
                'message' => 'تم تحديث الدعوة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/supervisor/invitations/{invitationId}
     * حذف دعوة
     */
    public function deleteSupervisorInvitation(Request $request, $invitationId)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $invitation = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->where('invitation_id', $invitationId)
                ->first();

            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }

            $invitation->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الدعوة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/invitations/statistics
     * إحصائيات الدعوات
     */
    public function getInvitationsStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $totalInvitations = SupervisorInvitation::where('supervisor_id', $user->user_id)->count();
            $pendingInvitations = SupervisorInvitation::where('supervisor_id', $user->user_id)->where('status', 'pending')->count();
            $acceptedInvitations = SupervisorInvitation::where('supervisor_id', $user->user_id)->where('status', 'accepted')->count();
            $expiredInvitations = SupervisorInvitation::where('supervisor_id', $user->user_id)->where('status', 'expired')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $totalInvitations,
                    'pending' => $pendingInvitations,
                    'accepted' => $acceptedInvitations,
                    'expired' => $expiredInvitations
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إحصائيات الدعوات'
            ], 500);
        }
    }
}