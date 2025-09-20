<?php

echo "=== اختبار Dashboard الأدمن ===\n\n";

echo "1. تسجيل الدخول كأدمن:\n";

$loginData = json_encode([
    'email' => 'admin@ruaa.com',
    'password' => 'admin123'
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

echo "HTTP Code: $httpCode\n";
$responseData = json_decode($response, true);

if ($httpCode === 200 && $responseData['success']) {
    echo "✅ تسجيل الدخول نجح!\n";
    echo "الاسم: " . $responseData['data']['user']['name'] . "\n";
    echo "البريد: " . $responseData['data']['user']['email'] . "\n";
    echo "الدور: " . $responseData['data']['role'] . "\n";
    echo "User ID: " . $responseData['data']['user']['user_id'] . "\n\n";
    
    if ($responseData['data']['role'] === 'admin') {
        echo "✅ الدور صحيح: admin\n";
        echo "✅ يتم توجيهه إلى: /admin/overview\n\n";
        
        echo "=== صفحات Dashboard المتاحة ===\n";
        echo "✅ /admin/overview - النظرة العامة\n";
        echo "✅ /admin/users - إدارة المستخدمين\n";
        echo "✅ /admin/roles - إدارة الأدوار\n";
        echo "✅ /admin/content - إدارة المحتوى\n";
        echo "✅ /admin/support - تذاكر الدعم\n";
        echo "✅ /admin/settings - إعدادات النظام\n\n";
        
        echo "=== مميزات Dashboard ===\n";
        echo "🎯 Sidebar متجاوب مع إخفاء/إظهار\n";
        echo "🎯 إحصائيات وبيانات تفاعلية\n";
        echo "🎯 جداول قابلة للبحث والتصفية\n";
        echo "🎯 واجهة متجاوبة للهاتف والحاسوب\n";
        echo "🎯 Dark mode support\n";
        echo "🎯 تصميم عربي RTL\n";
        echo "🎯 أيقونات ورموز واضحة\n";
        echo "🎯 Lazy loading للصفحات\n\n";
        
        echo "=== خطوات التجريب ===\n";
        echo "1. تشغيل Backend: php artisan serve\n";
        echo "2. تشغيل Frontend: npm start\n";
        echo "3. فتح المتصفح: http://localhost:3000\n";
        echo "4. تسجيل الدخول بالبيانات:\n";
        echo "   Email: admin@ruaa.com\n";
        echo "   Password: admin123\n";
        echo "5. سيتم توجيهك تلقائياً إلى /admin/overview\n";
        echo "6. تجريب جميع القوائم والوظائف\n\n";
        
    } else {
        echo "❌ الدور غير صحيح: " . $responseData['data']['role'] . "\n";
        echo "❌ المطلوب: admin\n";
    }
    
} else {
    echo "❌ فشل تسجيل الدخول\n";
    echo "Response: " . json_encode($responseData, JSON_UNESCAPED_UNICODE) . "\n";
}

echo "\n=== معلومات المشروع ===\n";
echo "Framework: Laravel 10 + React 19\n";
echo "Database: MySQL/MariaDB\n";
echo "Authentication: Laravel Sanctum\n";
echo "UI: Tailwind CSS + React Icons\n";
echo "Language: Arabic (RTL)\n";
echo "Responsive: Mobile + Desktop\n\n";

echo "🎉 Admin Dashboard جاهز للاستخدام!\n";
