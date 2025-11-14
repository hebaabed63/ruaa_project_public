<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Create test supervisor user if not exists
$supervisor = DB::table('users')->where('email', 'supervisor@ruaa.com')->first();

if (!$supervisor) {
    $supervisorId = DB::table('users')->insertGetId([
        'name' => 'المشرف أحمد',
        'email' => 'supervisor@ruaa.com',
        'password' => bcrypt('supervisor123'),
        'role' => 1, // supervisor
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    echo "✅ تم إنشاء حساب المشرف: supervisor@ruaa.com (كلمة المرور: supervisor123)\n";
} else {
    $supervisorId = $supervisor->user_id;
    echo "ℹ️  حساب المشرف موجود بالفعل: supervisor@ruaa.com\n";
}

// Create principal invitation link for supervisor
$principalToken = Str::random(32);
$principalLinkId = DB::table('supervisor_links')->insertGetId([
    'token' => $principalToken,
    'link_type' => 'principal',
    'organization_id' => $supervisorId, // ربط الرابط بالمشرف
    'is_active' => true,
    'expires_at' => now()->addWeeks(2),
    'max_uses' => 5,
    'used_count' => 0,
    'created_at' => now(),
    'updated_at' => now()
]);

echo "✅ تم إنشاء رابط دعوة مدير مدرسة مرتبط بالمشرف:\n";
echo "🔗 http://localhost:3000/register/principal?supervisor_token={$principalToken}\n";

echo "\n📋 ملخص النظام:\n";
echo "1. صفحة تسجيل مدراء المدارس: /register/principal?supervisor_token={token}\n";
echo "2. إدارة الدعوات في لوحة المشرف: /dashboard/supervisor/principal-links\n";
echo "3. تسجيل الدخول للمشرف: /login (supervisor@ruaa.com / supervisor123)\n";

echo "\n🎯 الآن يمكنك:\n";
echo "- تسجيل الدخول كمشرف\n";
echo "- إنشاء روابط دعوة جديدة لمدراء المدارس\n";
echo "- تتبع استخدام الروابط\n";
echo "- إدارة حالة الروابط (تفعيل/تعطيل)\n";