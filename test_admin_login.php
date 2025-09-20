<?php

echo "=== اختبار تسجيل الدخول للأدمن ===\n";

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
echo "Response: " . json_encode($responseData, JSON_UNESCAPED_UNICODE) . "\n";

if ($httpCode === 200 && $responseData['success']) {
    echo "✅ تسجيل الدخول نجح!\n";
    echo "الاسم: " . $responseData['data']['user']['name'] . "\n";
    echo "البريد: " . $responseData['data']['user']['email'] . "\n";
    echo "الدور: " . $responseData['data']['role'] . "\n";
    echo "Token: " . substr($responseData['data']['token'], 0, 20) . "...\n";
    
    if ($responseData['data']['role'] === 'admin') {
        echo "✅ الدور صحيح: admin\n";
        echo "✅ يجب أن يتم توجيهه إلى: /admin/overview\n";
    } else {
        echo "❌ الدور غير صحيح: " . $responseData['data']['role'] . "\n";
    }
} else {
    echo "❌ فشل تسجيل الدخول\n";
}
