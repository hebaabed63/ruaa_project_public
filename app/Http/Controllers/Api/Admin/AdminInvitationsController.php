<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SupervisorInvitation;
use App\Models\School;
use App\Models\User;

class AdminInvitationsController extends Controller
{
    /**
     * Get all invitations with filtering and pagination
     */
    public function getInvitations(Request $request)
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
            
            $query = SupervisorInvitation::with(['school', 'supervisor']);
            
            // تطبيق الفلاتر إذا كانت موجودة
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->has('school_id')) {
                $query->where('school_id', $request->school_id);
            }
            
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('invitee_name', 'like', "%{$search}%")
                      ->orWhere('invitee_email', 'like', "%{$search}%");
                });
            }
            
            // ترتيب النتائج
            $query->orderBy('created_at', 'desc');
            
            // تطبيق الترقيم
            $invitations = $query->paginate(10);
            
            // تحويل الحالات إلى نصوص عربية
            $statusMapping = [
                'pending' => 'معلق',
                'accepted' => 'مقبول',
                'rejected' => 'مرفوض',
                'expired' => 'منتهي'
            ];
            
            $invitations->getCollection()->transform(function ($invitation) use ($statusMapping) {
                $invitation->status_name = $statusMapping[$invitation->status] ?? $invitation->status;
                return $invitation;
            });
            
            return response()->json([
                'success' => true,
                'data' => $invitations,
                'message' => 'تم جلب الدعوات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الدعوات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get invitation details
     */
    public function getInvitationDetails(Request $request, $invitationId)
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
            
            $invitation = SupervisorInvitation::with(['school', 'supervisor'])->find($invitationId);
            
            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة'
                ], 404);
            }
            
            // تحويل الحالة إلى نص عربي
            $statusMapping = [
                'pending' => 'معلق',
                'accepted' => 'مقبول',
                'rejected' => 'مرفوض',
                'expired' => 'منتهي'
            ];
            
            $invitation->status_name = $statusMapping[$invitation->status] ?? $invitation->status;
            
            return response()->json([
                'success' => true,
                'data' => $invitation,
                'message' => 'تم جلب تفاصيل الدعوة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new invitation
     */
    public function createInvitation(Request $request)
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
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'school_id' => 'required|exists:schools,school_id',
                'supervisor_id' => 'required|exists:users,user_id',
                'invitee_name' => 'required|string|max:255',
                'invitee_email' => 'required|email|unique:supervisor_invitations,invitee_email',
                'message' => 'nullable|string',
                'expires_in_days' => 'nullable|integer|min:1|max:365'
            ]);
            
            $token = uniqid('inv_' . time() . '_', true);
            $expiresAt = now()->addDays($validatedData['expires_in_days'] ?? 30);
            
            $invitation = SupervisorInvitation::create([
                'school_id' => $validatedData['school_id'],
                'supervisor_id' => $validatedData['supervisor_id'],
                'invitee_name' => $validatedData['invitee_name'],
                'invitee_email' => $validatedData['invitee_email'],
                'token' => $token,
                'message' => $validatedData['message'] ?? null,
                'expires_at' => $expiresAt,
                'status' => 'pending'
            ]);
            
            // تحميل العلاقات
            $invitation->load(['school', 'supervisor']);
            
            // تحويل الحالة إلى نص عربي
            $statusMapping = [
                'pending' => 'معلق',
                'accepted' => 'مقبول',
                'rejected' => 'مرفوض',
                'expired' => 'منتهي'
            ];
            
            $invitation->status_name = $statusMapping[$invitation->status] ?? $invitation->status;
            
            return response()->json([
                'success' => true,
                'data' => $invitation,
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
     * Update invitation
     */
    public function updateInvitation(Request $request, $invitationId)
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
            
            $invitation = SupervisorInvitation::find($invitationId);
            
            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'status' => 'sometimes|required|in:pending,accepted,rejected,expired',
                'message' => 'nullable|string'
            ]);
            
            $invitation->update($validatedData);
            
            // تحويل الحالة إلى نص عربي
            $statusMapping = [
                'pending' => 'معلق',
                'accepted' => 'مقبول',
                'rejected' => 'مرفوض',
                'expired' => 'منتهي'
            ];
            
            $invitation->status_name = $statusMapping[$invitation->status] ?? $invitation->status;
            
            return response()->json([
                'success' => true,
                'data' => $invitation,
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
     * Delete invitation
     */
    public function deleteInvitation(Request $request, $invitationId)
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
            
            $invitation = SupervisorInvitation::find($invitationId);
            
            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة'
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
}