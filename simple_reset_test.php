<?php

echo "=== اختبار بسيط لنظام استعادة كلمة المرور ===\n\n";

// اختبار 1: تحقق من الاتصال بالخادم
echo "1. اختبار الاتصال بالخادم:\n";

$testUrl = 'http://127.0.0.1:8000/api/auth/register';
$testData = [
    'fullName' => 'مستخدم الاختبار',
    'email' => 'test' . time() . '@example.com',
    'password' => 'password123',
    'confirmPassword' => 'password123'
];

$ch = curl_init($testUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
} else {
    echo "Response: " . substr($response, 0, 200) . "\n";
}

if ($httpCode === 0) {
    echo "❌ لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على المنفذ 8000\n";
    echo "قم بتشغيل: php artisan serve\n\n";
} elseif ($httpCode >= 200 && $httpCode < 300) {
    echo "✅ الخادم يعمل بشكل طبيعي!\n\n";
} else {
    echo "⚠️ الخادم يستجيب لكن هناك مشكلة في الكود. HTTP Code: $httpCode\n\n";
}

echo "=== انتهى الاختبار ===\n";
