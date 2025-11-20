<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\School;
use App\Models\Report;
use App\Models\SupervisorInvitation;

class AdminDashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function getDashboardStats(Request $request)
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
            
            // إحصائيات المستخدمين
            $totalUsers = User::count();
            $activeUsers = User::where('status', 'active')->count();
            $pendingUsers = User::where('status', 'pending')->count();
            
            // إحصائيات المدارس
            $totalSchools = School::count();
            
            // إحصائيات التقارير
            $totalReports = Report::count();
            
            // إحصائيات الدعوات
            $totalInvitations = SupervisorInvitation::count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'totalUsers' => $totalUsers,
                    'activeUsers' => $activeUsers,
                    'pendingUsers' => $pendingUsers,
                    'totalSchools' => $totalSchools,
                    'totalReports' => $totalReports,
                    'totalInvitations' => $totalInvitations
                ],
                'message' => 'تم جلب إحصائيات لوحة التحكم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get users with filtering and pagination
     */
    public function getUsers(Request $request)
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
            
            $query = User::query();
            
            // تطبيق الفلاتر إذا كانت موجودة
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // ترتيب النتائج
            $query->orderBy('created_at', 'desc');
            
            // تطبيق الترقيم
            $users = $query->paginate(10);
            
            // تحويل الأدوار إلى نصوص
            $roleNames = [
                0 => 'مدير النظام',
                1 => 'مشرف',
                2 => 'مدير مدرسة',
                3 => 'ولي أمر'
            ];
            
            $users->getCollection()->transform(function ($user) use ($roleNames) {
                $user->role_name = $roleNames[$user->role] ?? 'غير محدد';
                return $user;
            });
            
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
     * Get user details
     */
    public function getUserDetails(Request $request, $userId)
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
            
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }
            
            // تحويل الدور إلى نص
            $roleNames = [
                0 => 'مدير النظام',
                1 => 'مشرف',
                2 => 'مدير مدرسة',
                3 => 'ولي أمر'
            ];
            
            $user->role_name = $roleNames[$user->role] ?? 'غير محدد';
            
            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'تم جلب تفاصيل المستخدم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update user status
     */
    public function updateUserStatus(Request $request, $userId)
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
            
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'status' => 'required|in:active,pending,suspended,rejected'
            ]);
            
            $user->status = $validatedData['status'];
            $user->save();
            
            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'تم تحديث حالة المستخدم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث حالة المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete user
     */
    public function deleteUser(Request $request, $userId)
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
            
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }
            
            // منع حذف نفس المستخدم
            if ($user->user_id === $admin->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكنك حذف حسابك الخاص'
                ], 400);
            }
            
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف المستخدم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get recent user registrations
     */
    public function getRecentRegistrations(Request $request)
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
            
            // Get recent user registrations
            $recentRegistrations = User::select('user_id', 'name', 'email', 'role', 'created_at as registered_at')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            
            // تحويل الأدوار إلى نصوص
            $roleNames = [
                0 => 'مدير النظام',
                1 => 'مشرف',
                2 => 'مدير مدرسة',
                3 => 'ولي أمر'
            ];
            
            $recentRegistrations->transform(function ($user) use ($roleNames) {
                $user->role_name = $roleNames[$user->role] ?? 'غير محدد';
                return $user;
            });
            
            return response()->json([
                'success' => true,
                'data' => $recentRegistrations,
                'message' => 'تم جلب أحدث التسجيلات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب أحدث التسجيلات: ' . $e->getMessage()
            ], 500);
        }
    }
}