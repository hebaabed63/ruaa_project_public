<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    // تحديث كلمة مرور الأدمين
    $admin = User::where('email', 'admin@ruaa.com')->first();
    
    if ($admin) {
        $admin->password = Hash::make('admin123');
        $admin->save();
        
        echo "✅ تم تحديث كلمة مرور الأدمين بنجاح!\n";
        echo "📧 البريد الإلكتروني: admin@ruaa.com\n";
        echo "🔑 كلمة المرور الجديدة: admin123\n";
    } else {
        echo "❌ لم يتم العثور على مستخدم الأدمين\n";
    }
    
} catch (Exception $e) {
    echo "❌ خطأ في تحديث كلمة مرور الأدمين: " . $e->getMessage() . "\n";
}