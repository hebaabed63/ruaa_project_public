<?php

echo "=== اختبار سريع للخادم ===\n\n";

// اختبار اتصال بسيط
$testUrl = 'http://127.0.0.1:8000/api/auth/register';

$ch = curl_init($testUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "1. اختبار الاتصال بالخادم:\n";
echo "URL: $testUrl\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
} elseif ($httpCode === 0) {
    echo "❌ لا يمكن الوصول للخادم\n";
    echo "تأكد من تشغيل: php artisan serve\n";
} elseif ($httpCode >= 200 && $httpCode < 500) {
    echo "✅ الخادم يعمل بشكل طبيعي!\n";
} else {
    echo "⚠️ استجابة غير متوقعة من الخادم\n";
}

echo "\n2. اختبار مع بيانات:\n";

// اختبار مع إرسال بيانات
$testData = [
    'fullName' => 'اختبار',
    'email' => 'test@test.com',
    'password' => '123456',
    'confirmPassword' => '123456'
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
    echo "❌ Error: $error\n";
} else {
    echo "Response Length: " . strlen($response) . " characters\n";
    if ($response) {
        $decoded = json_decode($response, true);
        if ($decoded) {
            echo "JSON Response: " . (isset($decoded['message']) ? $decoded['message'] : 'Valid JSON') . "\n";
            if ($httpCode >= 200 && $httpCode < 300) {
                echo "✅ API يعمل بشكل صحيح!\n";
            } elseif ($httpCode == 422) {
                echo "⚠️ خطأ في التحقق من البيانات (طبيعي للاختبار)\n";
            } else {
                echo "⚠️ HTTP Code: $httpCode\n";
            }
        } else {
            echo "❌ Invalid JSON response\n";
            echo "First 200 chars: " . substr($response, 0, 200) . "\n";
        }
    }
}

echo "\n=== انتهى الاختبار ===\n";
