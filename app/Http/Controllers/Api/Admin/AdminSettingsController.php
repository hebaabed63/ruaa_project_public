<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class AdminSettingsController extends Controller
{
    /**
     * Get system settings (for admin)
     */
    public function getSystemSettings(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get settings from database
            $settings = Setting::all()->keyBy('key')->map(function ($setting) {
                // Convert value based on type
                switch ($setting->type) {
                    case 'boolean':
                        return (bool) $setting->value;
                    case 'integer':
                        return (int) $setting->value;
                    case 'json':
                        return json_decode($setting->value, true);
                    default:
                        return $setting->value;
                }
            });

            // Convert to the format expected by the frontend
            $formattedSettings = [
                'site_name' => $settings['site_name'] ?? 'منصة رؤى التعليمية',
                'site_description' => $settings['site_description'] ?? 'منصة شاملة لإدارة المدارس والطلاب والمعلمين',
                'contact_email' => $settings['contact_email'] ?? 'support@ruaa.edu.sa',
                'contact_phone' => $settings['contact_phone'] ?? '+966 11 123 4567',
                'smtp_host' => $settings['smtp_host'] ?? 'smtp.gmail.com',
                'smtp_port' => $settings['smtp_port'] ?? '587',
                'smtp_username' => $settings['smtp_username'] ?? 'noreply@ruaa.edu.sa',
                'smtp_encryption' => $settings['smtp_encryption'] ?? 'tls',
                'email_notifications' => $settings['email_notifications'] ?? true,
                'sms_notifications' => $settings['sms_notifications'] ?? false,
                'push_notifications' => $settings['push_notifications'] ?? true,
                'password_min_length' => $settings['password_min_length'] ?? 8,
                'password_require_numbers' => $settings['password_require_numbers'] ?? true,
                'password_require_special_chars' => $settings['password_require_special_chars'] ?? true,
                'session_timeout' => $settings['session_timeout'] ?? 30,
                'theme' => $settings['theme'] ?? 'light',
                'language' => $settings['language'] ?? 'ar',
                'date_format' => $settings['date_format'] ?? 'DD/MM/YYYY',
                'time_format' => $settings['time_format'] ?? '24h',
                'maintenance_mode' => $settings['maintenance_mode'] ?? false,
                'maintenance_message' => $settings['maintenance_message'] ?? 'النظام قيد الصيانة، يرجى المحاولة لاحقاً'
            ];

            return response()->json([
                'success' => true,
                'data' => $formattedSettings,
                'message' => 'تم جلب إعدادات النظام بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إعدادات النظام: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update system settings (for admin)
     */
    public function updateSystemSettings(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث إعدادات النظام'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'site_name' => 'required|string|max:255',
                'site_description' => 'nullable|string',
                'contact_email' => 'required|email|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'smtp_host' => 'nullable|string|max:255',
                'smtp_port' => 'nullable|string|max:5',
                'smtp_username' => 'nullable|email|max:255',
                'smtp_password' => 'nullable|string|max:255',
                'smtp_encryption' => 'nullable|in:tls,ssl,none',
                'email_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'password_min_length' => 'required|integer|min:6|max:128',
                'password_require_numbers' => 'boolean',
                'password_require_special_chars' => 'boolean',
                'session_timeout' => 'required|integer|min:5|max:1440',
                'theme' => 'required|in:light,dark',
                'language' => 'required|in:ar,en',
                'date_format' => 'required|string|max:20',
                'time_format' => 'required|in:12h,24h',
                'maintenance_mode' => 'boolean',
                'maintenance_message' => 'nullable|string|max:500'
            ]);

            // Update settings in database
            foreach ($validated as $key => $value) {
                // Skip password field if empty
                if ($key === 'smtp_password' && empty($value)) {
                    continue;
                }
                
                // Determine the type of the setting
                $type = 'string';
                if (in_array($key, ['email_notifications', 'sms_notifications', 'push_notifications', 'password_require_numbers', 'password_require_special_chars', 'maintenance_mode'])) {
                    $type = 'boolean';
                } elseif (in_array($key, ['password_min_length', 'session_timeout'])) {
                    $type = 'integer';
                }
                
                // Update or create the setting
                Setting::updateOrCreate(
                    ['key' => $key],
                    [
                        'value' => $value,
                        'type' => $type,
                        'group' => $this->getSettingGroup($key)
                    ]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات النظام بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث إعدادات النظام: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get setting group based on key
     */
    private function getSettingGroup($key)
    {
        $groups = [
            'general' => ['site_name', 'site_description', 'contact_email', 'contact_phone'],
            'email' => ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption'],
            'notifications' => ['email_notifications', 'sms_notifications', 'push_notifications'],
            'security' => ['password_min_length', 'password_require_numbers', 'password_require_special_chars', 'session_timeout'],
            'appearance' => ['theme', 'language', 'date_format', 'time_format'],
            'maintenance' => ['maintenance_mode', 'maintenance_message']
        ];
        
        foreach ($groups as $group => $keys) {
            if (in_array($key, $keys)) {
                return $group;
            }
        }
        
        return 'general';
    }
}