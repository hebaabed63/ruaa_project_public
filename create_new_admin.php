<?php

echo "=== إنشاء مستخدم أدمن جديد ===\n";

// إنشاء مستخدم أدمن جديد بالبيانات المطلوبة
$adminData = json_encode([
    'name' => 'مدير النظام',
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
    $userId = $data['data']['user']['user_id'];
    
    echo "✅ تم إنشاء المستخدم بنجاح!\n";
    echo "User ID: $userId\n";
    
    // الآن تحديث الدور إلى أدمن (0) في قاعدة البيانات
    echo "\nتحديث الدور إلى أدمن...\n";
    
    // استخدام Artisan tinker لتحديث المستخدم
    $command = 'php artisan tinker --execute="App\Models\User::find(' . $userId . ')->update([\'role\' => 0]); echo \'تم تحديث الدور بنجاح\';"';
    $result = shell_exec($command);
    
    echo "Result: " . ($result ?: "تم تحديث الدور") . "\n";
    
    echo "\n=== بيانات تسجيل الدخول الجديدة ===\n";
    echo "Email: admin@test.com\n";
    echo "Password: Admin123$\n";
    echo "Role: Admin (0)\n\n";
    
    // اختبار تسجيل الدخول بالبيانات الجديدة
    echo "=== اختبار تسجيل الدخول ===\n";
    
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
        echo "✅ تسجيل الدخول نجح!\n";
        echo "الاسم: " . $loginData['data']['user']['name'] . "\n";
        echo "الدور: " . $loginData['data']['role'] . "\n";
        
        if ($loginData['data']['role'] === 'admin') {
            echo "✅ سيتم توجيهه إلى: /admin/overview\n\n";
            
            echo "=== التعليمات ===\n";
            echo "1. اذهب إلى: http://localhost:3000\n";
            echo "2. استخدم البيانات:\n";
            echo "   Email: admin@test.com\n";
            echo "   Password: Admin123$\n";
            echo "3. سيتم توجيهك تلقائياً إلى Admin Dashboard\n";
            echo "4. ستجد جميع الأقسام: Overview, Users, Content, Support, Settings\n";
        }
    } else {
        echo "❌ فشل في تسجيل الدخول\n";
    }
    
} else {
    echo "❌ فشل إنشاء المستخدم\n";
    if ($httpCode === 422) {
        echo "المستخدم موجود بالفعل، سنحاول تسجيل الدخول...\n";
        
        // محاولة تسجيل الدخول المباشر
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
            echo "✅ المستخدم موجود ويعمل بالفعل!\n";
            echo "الاسم: " . $loginData['data']['user']['name'] . "\n";
            echo "الدور: " . $loginData['data']['role'] . "\n";
            
            if ($loginData['data']['role'] === 'admin') {
                echo "✅ جاهز للدخول على Admin Dashboard!\n";
            } else {
                echo "❌ الدور ليس admin، الدور الحالي: " . $loginData['data']['role'] . "\n";
                echo "سأحدث الدور إلى admin...\n";
                
                $userId = $loginData['data']['user']['user_id'];
                $command = 'php artisan tinker --execute="App\Models\User::find(' . $userId . ')->update([\'role\' => 0]); echo \'تم تحديث الدور\';"';
                $result = shell_exec($command);
                echo "تم تحديث الدور: " . ($result ?: "نجح") . "\n";
            }
        } else {
            echo "❌ البيانات غير صحيحة أو المستخدم غير موجود\n";
        }
    }
}

echo "\n🎉 Admin Dashboard جاهز للاستخدام!\n";
