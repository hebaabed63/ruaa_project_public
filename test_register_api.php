<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

try {
    // محاكاة بيانات التسجيل
    $data = [
        'fullName' => 'تست مستخدم',
        'email' => 'test@example.com',
        'password' => '123456',
        'confirmPassword' => '123456'
    ];

    // حذف المستخدم إذا كان موجوداً
    App\Models\User::where('email', $data['email'])->delete();

    // إنشاء طلب مزيف
    $request = new Request();
    $request->merge($data);

    // إنشاء الكونترولر واختبار التسجيل
    $controller = new AuthController();
    $response = $controller->register($request);

    echo "=== اختبار API التسجيل ===\n";
    echo "📧 البريد: " . $data['email'] . "\n";
    echo "👤 الاسم: " . $data['fullName'] . "\n";
    echo "🔑 كلمة المرور: " . $data['password'] . "\n";
    echo "\n=== الاستجابة ===\n";
    echo "Status Code: " . $response->status() . "\n";
    echo "Content: " . $response->getContent() . "\n";
    
    $content = json_decode($response->getContent(), true);
    if ($content && isset($content['success']) && $content['success']) {
        echo "\n✅ التسجيل نجح!\n";
    } else {
        echo "\n❌ التسجيل فشل!\n";
        if (isset($content['errors'])) {
            print_r($content['errors']);
        }
    }

} catch (Exception $e) {
    echo "❌ خطأ في الاختبار: " . $e->getMessage() . "\n";
    echo "📍 الملف: " . $e->getFile() . "\n";
    echo "📍 السطر: " . $e->getLine() . "\n";
}
