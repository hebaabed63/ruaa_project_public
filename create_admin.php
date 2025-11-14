<?php

echo "=== إنشاء مستخدم أدمن ===\n";

// إنشاء مستخدم أدمن
$adminData = json_encode([
    'fullName' => 'أدمن النظام',
    'email' => 'admin@ruaa.com',
    'password' => 'admin123',
    'confirmPassword' => 'admin123'
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
    $userId = $data['data']['user']['user_id'];
    
    echo "✅ تم إنشاء المستخدم بنجاح!\n";
    echo "User ID: $userId\n";
    
    // الآن تحديث الدور إلى أدمن (0) في قاعدة البيانات
    echo "\nتحديث الدور إلى أدمن...\n";
    
    // استخدام Artisan tinker لتحديث المستخدم
    $command = 'php artisan tinker --execute="App\Models\User::find(' . $userId . ')->update([\'role\' => 0]); echo \'تم تحديث الدور بنجاح\';"';
    $result = shell_exec($command);
    
    echo "Result: " . ($result ?: "تم تحديث الدور") . "\n";
    
    echo "\n=== بيانات تسجيل الدخول للأدمن ===\n";
    echo "Email: admin@ruaa.com\n";
    echo "Password: admin123\n";
    echo "Role: Admin (0)\n";
    
} else {
    echo "❌ فشل إنشاء المستخدم\n";
    if ($httpCode === 422) {
        echo "المستخدم موجود بالفعل، سنحاول تسجيل الدخول...\n";
        
        // محاولة تسجيل الدخول
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

        $loginResponse = curl_exec($ch);
        $loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo "Login HTTP Code: $loginHttpCode\n";
        echo "Login Response: " . json_encode(json_decode($loginResponse, true), JSON_UNESCAPED_UNICODE) . "\n";
        
        if ($loginHttpCode === 200) {
            $loginData = json_decode($loginResponse, true);
            echo "✅ الأدمن موجود ويعمل بالفعل!\n";
            echo "Role: " . $loginData['data']['role'] . "\n";
        }
    }
}
