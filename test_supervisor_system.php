<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Create test admin user if not exists
$admin = DB::table('users')->where('email', 'admin@ruaa.com')->first();

if (!$admin) {
    $adminId = DB::table('users')->insertGetId([
        'name' => 'مدير النظام',
        'email' => 'admin@ruaa.com',
        'password' => bcrypt('admin123'),
        'role' => 0, // admin
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    echo "✅ تم إنشاء حساب المدير: admin@ruaa.com (كلمة المرور: admin123)\n";
} else {
    echo "ℹ️  حساب المدير موجود بالفعل: admin@ruaa.com\n";
}

// Create supervisor invitation link
$supervisorToken = Str::random(32);
$supervisorLinkId = DB::table('supervisor_links')->insertGetId([
    'token' => $supervisorToken,
    'link_type' => 'supervisor',
    'organization_id' => null,
    'is_active' => true,
    'expires_at' => now()->addWeeks(2),
    'max_uses' => 10,
    'used_count' => 0,
    'created_at' => now(),
    'updated_at' => now()
]);

echo "✅ تم إنشاء رابط دعوة المشرف:\n";
echo "🔗 http://localhost:3000/register/supervisor/{$supervisorToken}\n";

// Create principal invitation link
$principalToken = Str::random(32);
$principalLinkId = DB::table('supervisor_links')->insertGetId([
    'token' => $principalToken,
    'link_type' => 'principal',
    'organization_id' => null,
    'is_active' => true,
    'expires_at' => now()->addWeeks(2),
    'max_uses' => 5,
    'used_count' => 0,
    'created_at' => now(),
    'updated_at' => now()
]);

echo "✅ تم إنشاء رابط دعوة مدير المدرسة:\n";
echo "🔗 http://localhost:3000/register/principal?supervisor_token={$principalToken}\n";

echo "\n📋 ملخص النظام:\n";
echo "1. صفحة تسجيل المشرفين: /register/supervisor/{token}\n";
echo "2. صفحة تسجيل مدراء المدارس: /register/principal?supervisor_token={token}\n";
echo "3. إدارة الدعوات في لوحة الأدمن: /admin/supervisor-links\n";
echo "4. تسجيل الدخول للأدمن: /login (admin@ruaa.com / admin123)\n";

echo "\n🎯 الآن يمكنك:\n";
echo "- تسجيل الدخول كأدمن\n";
echo "- إنشاء روابط دعوة جديدة\n";
echo "- تتبع استخدام الروابط\n";
echo "- إدارة حالة الروابط (تفعيل/تعطيل)\n";