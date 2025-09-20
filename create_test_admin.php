<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    // حذف الأدمين السابق إذا كان موجوداً
    User::where('email', 'admin@test.com')->delete();
    
    // إنشاء حساب أدمين جديد
    $admin = User::create([
        'name' => 'مدير النظام',
        'email' => 'admin@test.com',
        'password' => Hash::make('123456'),
        'role' => 0, // admin role
    ]);

    echo "✅ تم إنشاء حساب الأدمين بنجاح!\n";
    echo "📧 البريد الإلكتروني: admin@test.com\n";
    echo "🔑 كلمة المرور: 123456\n";
    echo "👤 الدور: أدمين\n";
    echo "🆔 معرف المستخدم: " . $admin->user_id . "\n";
    
} catch (Exception $e) {
    echo "❌ خطأ في إنشاء حساب الأدمين: " . $e->getMessage() . "\n";
}
