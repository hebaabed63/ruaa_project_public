<?php

echo "=== اختبار تسجيل دخول الأدمين ===\n";

// بيانات تسجيل الدخول
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
echo "Response: " . json_encode(json_decode($response, true), JSON_UNESCAPED_UNICODE) . "\n";

if ($httpCode === 200) {
    echo "✅ تسجيل الدخول ناجح!\n";
    $data = json_decode($response, true);
    echo "Token: " . $data['data']['token'] . "\n";
    echo "Role: " . $data['data']['role'] . "\n";
} else {
    echo "❌ فشل تسجيل الدخول\n";
}