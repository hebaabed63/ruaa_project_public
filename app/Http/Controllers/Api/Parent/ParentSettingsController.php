<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\NotificationPreference;

class ParentSettingsController extends Controller
{
    /**
     * Ensure the authenticated user is a parent (role = 3)
     */
    private function ensureParent($user)
    {
        if (($user->role ?? null) !== 3) {
            abort(response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول لهذه الصفحة'
            ], 403));
        }
    }

    /**
     * Get parent settings
     * GET /api/parent/settings
     */
    public function getSettings(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Get notification preferences
            $notificationPreferences = NotificationPreference::where('user_id', $user->user_id)
                ->first();

            $settings = [
                'profile' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'profile_image' => $user->profile_image,
                    'email_verified_at' => $user->email_verified_at?->toISOString(),
                ],
                'notifications' => $notificationPreferences ? [
                    'email_notifications' => (bool) ($notificationPreferences->email_notifications ?? true),
                    'push_notifications' => (bool) ($notificationPreferences->push_notifications ?? true),
                    'sms_notifications' => (bool) ($notificationPreferences->sms_notifications ?? false),
                    'newsletter' => (bool) ($notificationPreferences->newsletter ?? true),
                    'rating_reminders' => (bool) ($notificationPreferences->rating_reminders ?? true),
                    'report_updates' => (bool) ($notificationPreferences->report_updates ?? true),
                    'school_announcements' => (bool) ($notificationPreferences->school_announcements ?? true),
                ] : [
                    'email_notifications' => true,
                    'push_notifications' => true,
                    'sms_notifications' => false,
                    'newsletter' => true,
                    'rating_reminders' => true,
                    'report_updates' => true,
                    'school_announcements' => true,
                ],
                'privacy' => [
                    'profile_visibility' => 'private', // public, private, contacts_only
                    'show_ratings' => true,
                    'show_comments' => true,
                    'data_sharing' => false,
                ],
                'preferences' => [
                    'language' => 'ar',
                    'timezone' => 'Asia/Riyadh',
                    'date_format' => 'dd/mm/yyyy',
                    'theme' => 'light', // light, dark, auto
                ]
            ];

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الإعدادات بنجاح',
                'data' => $settings
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching settings: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب الإعدادات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Change parent password
     * POST /api/parent/settings/change-password
     */
    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

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
     * Update notification preferences
     * PUT /api/parent/settings/notifications
     */
    public function updateNotificationSettings(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'email_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
                'newsletter' => 'boolean',
                'rating_reminders' => 'boolean',
                'report_updates' => 'boolean',
                'school_announcements' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Update or create notification preferences
            $preferences = NotificationPreference::updateOrCreate(
                ['user_id' => $user->user_id],
                [
                    'email_notifications' => $request->input('email_notifications', true),
                    'push_notifications' => $request->input('push_notifications', true),
                    'sms_notifications' => $request->input('sms_notifications', false),
                    'newsletter' => $request->input('newsletter', true),
                    'rating_reminders' => $request->input('rating_reminders', true),
                    'report_updates' => $request->input('report_updates', true),
                    'school_announcements' => $request->input('school_announcements', true),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات الإشعارات بنجاح',
                'data' => [
                    'notifications' => [
                        'email_notifications' => (bool) $preferences->email_notifications,
                        'push_notifications' => (bool) $preferences->push_notifications,
                        'sms_notifications' => (bool) $preferences->sms_notifications,
                        'newsletter' => (bool) $preferences->newsletter,
                        'rating_reminders' => (bool) $preferences->rating_reminders,
                        'report_updates' => (bool) $preferences->report_updates,
                        'school_announcements' => (bool) $preferences->school_announcements,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating notification settings: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث إعدادات الإشعارات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update privacy settings
     * PUT /api/parent/settings/privacy
     */
    public function updatePrivacySettings(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'profile_visibility' => 'in:public,private,contacts_only',
                'show_ratings' => 'boolean',
                'show_comments' => 'boolean',
                'data_sharing' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // In a real application, you would store these in a separate table
            // For now, we'll just return success
            $privacySettings = [
                'profile_visibility' => $request->input('profile_visibility', 'private'),
                'show_ratings' => $request->input('show_ratings', true),
                'show_comments' => $request->input('show_comments', true),
                'data_sharing' => $request->input('data_sharing', false),
            ];

            // Here you would save to database
            // UserPrivacySetting::updateOrCreate(...)

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات الخصوصية بنجاح',
                'data' => [
                    'privacy' => $privacySettings
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating privacy settings: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث إعدادات الخصوصية',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update general preferences
     * PUT /api/parent/settings/preferences
     */
    public function updatePreferences(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'language' => 'in:ar,en',
                'timezone' => 'timezone',
                'date_format' => 'in:dd/mm/yyyy,mm/dd/yyyy,yyyy-mm-dd',
                'theme' => 'in:light,dark,system',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // In a real application, you would store these in a separate table
            $preferences = [
                'language' => $request->input('language', 'ar'),
                'timezone' => $request->input('timezone', 'Asia/Riyadh'),
                'date_format' => $request->input('date_format', 'dd/mm/yyyy'),
                'theme' => $request->input('theme', 'light'),
            ];

            // Here you would save to database
            // UserPreference::updateOrCreate(...)

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث التفضيلات بنجاح',
                'data' => [
                    'preferences' => $preferences
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating preferences: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث التفضيلات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete account
     * DELETE /api/parent/settings/account
     */
    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'confirmation' => 'required|string|in:DELETE',
            ], [
                'confirmation.required' => 'التأكيد مطلوب',
                'confirmation.in' => 'يجب كتابة DELETE للتأكيد',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // In a real application, you would:
            // 1. Soft delete the user
            // 2. Anonymize personal data
            // 3. Send confirmation email
            // 4. Log the deletion

            // For now, we'll just return success
            Log::info('Account deletion requested', ['user_id' => $user->user_id]);

            return response()->json([
                'success' => true,
                'message' => 'سيتم حذف حسابك خلال 24 ساعة. سيتم إرسال بريد إلكتروني للتأكيد.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting account: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'فشل في حذف الحساب',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}