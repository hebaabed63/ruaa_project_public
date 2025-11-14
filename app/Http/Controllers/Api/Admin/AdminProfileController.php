<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class AdminProfileController extends Controller
{
    /**
     * Get admin profile
     */
    public function getAdminProfile(Request $request)
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
     * Update admin profile
     */
    public function updateAdminProfile(Request $request)
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
     * Update admin profile image
     */
    public function updateAdminProfileImage(Request $request)
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
     * Change admin password
     */
    public function changePassword(Request $request)
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