<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General settings
            [
                'key' => 'site_name',
                'value' => 'منصة رؤى التعليمية',
                'type' => 'string',
                'group' => 'general',
                'description' => 'اسم الموقع'
            ],
            [
                'key' => 'site_description',
                'value' => 'منصة شاملة لإدارة المدارس والطلاب والمعلمين',
                'type' => 'string',
                'group' => 'general',
                'description' => 'وصف الموقع'
            ],
            [
                'key' => 'contact_email',
                'value' => 'support@ruaa.edu.sa',
                'type' => 'string',
                'group' => 'general',
                'description' => 'البريد الإلكتروني للتواصل'
            ],
            [
                'key' => 'contact_phone',
                'value' => '+966 11 123 4567',
                'type' => 'string',
                'group' => 'general',
                'description' => 'رقم الهاتف للتواصل'
            ],
            
            // Email settings
            [
                'key' => 'smtp_host',
                'value' => 'smtp.gmail.com',
                'type' => 'string',
                'group' => 'email',
                'description' => 'خادم SMTP'
            ],
            [
                'key' => 'smtp_port',
                'value' => '587',
                'type' => 'string',
                'group' => 'email',
                'description' => 'منفذ SMTP'
            ],
            [
                'key' => 'smtp_username',
                'value' => 'noreply@ruaa.edu.sa',
                'type' => 'string',
                'group' => 'email',
                'description' => 'اسم المستخدم لـ SMTP'
            ],
            [
                'key' => 'smtp_encryption',
                'value' => 'tls',
                'type' => 'string',
                'group' => 'email',
                'description' => 'نوع التشفير لـ SMTP'
            ],
            
            // Notification settings
            [
                'key' => 'email_notifications',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'تفعيل إشعارات البريد الإلكتروني'
            ],
            [
                'key' => 'sms_notifications',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'تفعيل إشعارات الرسائل القصيرة'
            ],
            [
                'key' => 'push_notifications',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'تفعيل الإشعارات داخل التطبيق'
            ],
            
            // Security settings
            [
                'key' => 'password_min_length',
                'value' => '8',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'الحد الأدنى لطول كلمة المرور'
            ],
            [
                'key' => 'password_require_numbers',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'تتطلب كلمة المرور أرقاماً'
            ],
            [
                'key' => 'password_require_special_chars',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'تتطلب كلمة المرور أحرف خاصة'
            ],
            [
                'key' => 'session_timeout',
                'value' => '30',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'مهلة الجلسة (بالدقائق)'
            ],
            
            // Appearance settings
            [
                'key' => 'theme',
                'value' => 'light',
                'type' => 'string',
                'group' => 'appearance',
                'description' => 'السمة'
            ],
            [
                'key' => 'language',
                'value' => 'ar',
                'type' => 'string',
                'group' => 'appearance',
                'description' => 'اللغة'
            ],
            [
                'key' => 'date_format',
                'value' => 'DD/MM/YYYY',
                'type' => 'string',
                'group' => 'appearance',
                'description' => 'تنسيق التاريخ'
            ],
            [
                'key' => 'time_format',
                'value' => '24h',
                'type' => 'string',
                'group' => 'appearance',
                'description' => 'تنسيق الوقت'
            ],
            
            // Maintenance settings
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'maintenance',
                'description' => 'وضع الصيانة'
            ],
            [
                'key' => 'maintenance_message',
                'value' => 'النظام قيد الصيانة، يرجى المحاولة لاحقاً',
                'type' => 'string',
                'group' => 'maintenance',
                'description' => 'رسالة الصيانة'
            ]
        ];
        
        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}