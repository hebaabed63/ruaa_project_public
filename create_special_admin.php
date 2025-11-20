<?php

echo "=== إنشاء مستخدم أدمن خاص ===\n";

// إنشاء مستخدم أدمن خاص
$adminData = json_encode([
    'fullName' => 'Special Admin',
    'email' => 'admin@test.com',
    'password' => 'Admin123$',
    'confirmPassword' => 'Admin123$'
]);

$ch = curl_init('http://127.0.0.1:8000/api/auth/register');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $adminData);
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

if ($httpCode === 201) {
    $data = json_decode($response, true);
    
    echo "✅ تم إنشاء المستخدم الأدمن الخاص بنجاح!\n";
    echo "Email: admin@test.com\n";
    echo "Password: Admin123$\n";
    echo "Role: Admin (0)\n";
    echo "Status: Active\n";
    
} else {
    echo "❌ فشل إنشاء المستخدم\n";
    if ($httpCode === 422) {
        echo "المستخدم موجود بالفعل، سنحاول تسجيل الدخول...\n";
        
        // محاولة تسجيل الدخول
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

        $loginResponse = curl_exec($ch);
        $loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo "Login HTTP Code: $loginHttpCode\n";
        echo "Login Response: " . json_encode(json_decode($loginResponse, true), JSON_UNESCAPED_UNICODE) . "\n";
        
        if ($loginHttpCode === 200) {
            $loginData = json_decode($loginResponse, true);
            echo "✅ الأدمن الخاص موجود ويعمل بالفعل!\n";
            echo "Role: " . $loginData['data']['role'] . "\n";
            echo "Status: " . ($loginData['data']['status'] ?? 'active') . "\n";
        }
    }
}