<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class SupervisorProfileController extends Controller
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
     * GET /api/supervisor/profile
     * جلب بيانات الملف الشخصي للمشرف
     */
    public function getSupervisorProfile(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            // بيانات المشرف الأساسية
            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address' => $user->address ?? '',
                'profileImage' => $this->getProfileImageUrl($user->avatar),
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status ?? 'active',
                'role' => 'supervisor'
            ];

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم جلب بيانات الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            \Log::error('Supervisor Profile Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * PUT /api/supervisor/profile
     * تحديث بيانات الملف الشخصي للمشرف
     */
    public function updateSupervisorProfile(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $validatedData = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
            ]);

            $user->name = $validatedData['fullName'];
            $user->email = $validatedData['email'];
            $user->phone = $validatedData['phone'] ?? $user->phone;
            $user->address = $validatedData['address'] ?? $user->address;
            $user->save();

            // إرجاع البيانات المحدثة
            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address' => $user->address ?? '',
                'profileImage' => $this->getProfileImageUrl($user->avatar),
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status ?? 'active',
                'role' => 'supervisor'
            ];

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم تحديث بيانات الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            \Log::error('Supervisor Profile Update Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث بيانات الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/profile/avatar
     * تحديث صورة الملف الشخصي للمشرف
     */
    public function updateSupervisorProfileImage(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // حذف الصورة القديمة إذا كانت موجودة
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // رفع الصورة الجديدة
            $avatarPath = $request->file('avatar')->store('avatars/supervisors', 'public');
            
            // تحديث المسار في قاعدة البيانات
            $user->avatar = $avatarPath;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'profileImage' => $this->getProfileImageUrl($avatarPath)
                ],
                'message' => 'تم تحديث صورة الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            \Log::error('Supervisor Avatar Update Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث صورة الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/profile/password
     * تغيير كلمة مرور المشرف
     */
    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $validatedData = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            // التحقق من كلمة المرور الحالية
            if (!Hash::check($validatedData['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة'
                ], 422);
            }

            // تحديث كلمة المرور
            $user->password = Hash::make($validatedData['new_password']);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'يرجى التحقق من البيانات',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Supervisor Password Change Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تغيير كلمة المرور',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Helper method للحصول على رابط الصورة
     */
    private function getProfileImageUrl($avatarPath)
    {
        if (!$avatarPath) {
            return null;
        }

        // إذا الرابط يحتوي على http يعني هو رابط كامل
        if (strpos($avatarPath, 'http') === 0) {
            return $avatarPath;
        }

        // إذا المسار يبدأ بـ storage/ 
        if (strpos($avatarPath, 'storage/') === 0) {
            return asset($avatarPath);
        }

        // إذا المسار مخزن في الـ storage
        return asset('storage/' . $avatarPath);
    }
}