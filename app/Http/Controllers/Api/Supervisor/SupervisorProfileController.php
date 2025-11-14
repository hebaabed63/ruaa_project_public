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
     * جلب بيانات الملف الشخصي
     */
    public function getSupervisorProfile(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profileImage' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status
            ];

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم جلب بيانات الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/supervisor/profile
     * تحديث بيانات الملف الشخصي
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
            $user->phone = $validatedData['phone'];
            $user->address = $validatedData['address'];
            $user->save();

            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profileImage' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status
            ];

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم تحديث بيانات الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث بيانات الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/profile/avatar
     * تحديث صورة الملف الشخصي
     */
    public function updateSupervisorProfileImage(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($user->avatar && Storage::exists('public/' . $user->avatar)) {
                Storage::delete('public/' . $user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'profileImage' => asset('storage/' . $avatarPath)
                ],
                'message' => 'تم تحديث صورة الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث صورة الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/supervisor/profile/password
     * تغيير كلمة المرور
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

            if (!Hash::check($validatedData['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة'
                ], 422);
            }

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
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تغيير كلمة المرور: ' . $e->getMessage()
            ], 500);
        }
    }
}