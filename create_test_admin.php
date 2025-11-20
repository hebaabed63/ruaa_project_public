<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== إنشاء أو تحديث مستخدم الأدمين ===\n";

try {
    // البحث عن المستخدم admin@test.com
    $admin = User::where('email', 'admin@test.com')->first();
    
    if ($admin) {
        echo "✅ المستخدم admin@test.com موجود بالفعل\n";
        echo "🔄 تحديث كلمة المرور...\n";
        
        // تحديث كلمة المرور
        $admin->password = Hash::make('Admin123$');
        $admin->role = 0; // تأكد من أن الدور هو الأدمين
        $admin->save();
        
        echo "✅ تم تحديث كلمة مرور الأدمين بنجاح!\n";
        echo "📧 البريد الإلكتروني: admin@test.com\n";
        echo "🔑 كلمة المرور: Admin123$\n";
        echo "🔒 الدور: " . $admin->role . " (0 = أدمين)\n";
    } else {
        echo "🔄 إنشاء مستخدم أدمين جديد...\n";
        
        // إنشاء مستخدم أدمين جديد
        $admin = User::create([
            'name' => 'أدمين النظام',
            'email' => 'admin@test.com',
            'password' => Hash::make('Admin123$'),
            'role' => 0, // 0 = أدمين
            'status' => 'active'
        ]);
        
        echo "✅ تم إنشاء مستخدم الأدمين بنجاح!\n";
        echo "📧 البريد الإلكتروني: admin@test.com\n";
        echo "🔑 كلمة المرور: Admin123$\n";
        echo "🔒 الدور: " . $admin->role . " (0 = أدمين)\n";
    }
    
} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
}