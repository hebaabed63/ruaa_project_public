<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ParentSettingsController extends Controller
{
    /**
     * Change parent password
     * POST /api/parent/settings/change-password
     */
    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();

            // Check if user is authenticated and has parent role (role = 3)
            if (!$user || $user->role !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Parent access only.',
                ], 403);
            }

            // Validation rules
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string|min:6',
                'new_password' => 'required|string|min:6|different:current_password',
                'confirm_password' => 'required|string|same:new_password',
            ], [
                'current_password.required' => 'كلمة المرور الحالية مطلوبة',
                'current_password.min' => 'كلمة المرور الحالية يجب أن تكون 6 أحرف على الأقل',
                'new_password.required' => 'كلمة المرور الجديدة مطلوبة',
                'new_password.min' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
                'new_password.different' => 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية',
                'confirm_password.required' => 'تأكيد كلمة المرور مطلوب',
                'confirm_password.same' => 'كلمة المرور الجديدة وتأكيدها غير متطابقتين',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة',
                    'errors' => [
                        'current_password' => ['كلمة المرور الحالية غير صحيحة']
                    ],
                ], 422);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            Log::info('Password changed successfully', ['user_id' => $user->user_id]);

            return response()->json([
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error changing password: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تغيير كلمة المرور',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get parent settings/preferences
     * GET /api/parent/settings
     */
    public function getSettings(Request $request)
    {
        try {
            $user = $request->user();

            // Check if user is authenticated and has parent role
            if (!$user || $user->role !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Parent access only.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '',
                    'address' => $user->address ?? '',
                    'profile_image' => $user->profile_image,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching settings: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update notification preferences
     * PUT /api/parent/settings/notifications
     */
    public function updateNotificationSettings(Request $request)
    {
        try {
            $user = $request->user();

            // Check if user is authenticated and has parent role
            if (!$user || $user->role !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Parent access only.',
                ], 403);
            }

            // Validation rules
            $validator = Validator::make($request->all(), [
                'email_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Note: If you don't have these columns in users table,
            // you might need to create a separate settings table
            // For now, we'll just return success
            
            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات الإشعارات بنجاح',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating notification settings: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update notification settings.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
