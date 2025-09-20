<?php

echo "=== اختبار البيانات النهائية للأدمن ===\n\n";

echo "بيانات تسجيل الدخول المطلوبة:\n";
echo "Email: admin@test.com\n";
echo "Password: Admin123$\n\n";

$loginData = json_encode([
    'email' => 'admin@test.com',
    'password' => 'Admin123$'
]);

$ch = curl_init('http://127.0.0.1:8000/api/auth/login');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "=== نتيجة الاختبار ===\n";
echo "HTTP Code: $httpCode\n";
$responseData = json_decode($response, true);

if ($httpCode === 200 && $responseData['success']) {
    echo "✅ تسجيل الدخول نجح!\n\n";
    echo "=== معلومات المستخدم ===\n";
    echo "الاسم: " . $responseData['data']['user']['name'] . "\n";
    echo "البريد: " . $responseData['data']['user']['email'] . "\n";
    echo "الدور: " . $responseData['data']['role'] . "\n";
    echo "User ID: " . $responseData['data']['user']['user_id'] . "\n";
    echo "Token: " . substr($responseData['data']['token'], 0, 20) . "...\n\n";
    
    if ($responseData['data']['role'] === 'admin') {
        echo "✅ الدور صحيح: admin\n";
        echo "✅ التوجيه التلقائي: /admin/overview\n\n";
        
        echo "=== خطوات الاستخدام ===\n";
        echo "1. تشغيل Backend:\n";
        echo "   php artisan serve --host=127.0.0.1 --port=8000\n\n";
        echo "2. تشغيل Frontend:\n";
        echo "   cd frontend/my-project-main\n";
        echo "   npm start\n\n";
        echo "3. فتح المتصفح:\n";
        echo "   http://localhost:3000\n\n";
        echo "4. تسجيل الدخول:\n";
        echo "   Email: admin@test.com\n";
        echo "   Password: Admin123$\n\n";
        echo "5. سيتم توجيهك تلقائياً إلى:\n";
        echo "   http://localhost:3000/admin/overview\n\n";
        
        echo "=== أقسام Admin Dashboard ===\n";
        echo "📊 النظرة العامة - Overview\n";
        echo "👥 إدارة المستخدمين - Users\n";
        echo "🔒 إدارة الأدوار - Roles\n";
        echo "📄 إدارة المحتوى - Content\n";
        echo "🎫 تذاكر الدعم - Support\n";
        echo "⚙️ إعدادات النظام - Settings\n\n";
        
        echo "🎉 كل شيء جاهز للاستخدام!\n";
        
    } else {
        echo "❌ الدور غير صحيح: " . $responseData['data']['role'] . "\n";
        echo "المطلوب: admin\n";
    }
    
} else {
    echo "❌ فشل تسجيل الدخول\n";
    echo "Response: " . json_encode($responseData, JSON_UNESCAPED_UNICODE) . "\n";
    
    if ($httpCode === 401) {
        echo "\n❌ كلمة المرور غير صحيحة!\n";
        echo "تأكد من كلمة المرور: Admin123$\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "🎯 مُلخَّص البيانات النهائية:\n";
echo "Email: admin@test.com\n";
echo "Password: Admin123$\n";
echo "Dashboard: http://localhost:3000/admin/overview\n";
echo str_repeat("=", 50) . "\n";
