<?php

echo "=== اختبار التكامل بين الفرونت إند والباك إند ===\n\n";

// اختبار 1: التسجيل
echo "1. اختبار التسجيل:\n";
$uniqueEmail = 'testintegration' . time() . '@example.com';
$registerData = json_encode([
    'name' => 'مستخدم اختبار التكامل',
    'email' => $uniqueEmail,
    'password' => 'password123',
    'confirmPassword' => 'password123'
]);

$ch = curl_init('http://127.0.0.1:8000/api/auth/register');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $registerData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$registerResponse = curl_exec($ch);
$registerHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: {$registerHttpCode}\n";
$registerResponseData = json_decode($registerResponse, true);
echo "Response: " . json_encode($registerResponseData, JSON_UNESCAPED_UNICODE) . "\n";

if ($registerHttpCode === 201 && $registerResponseData['success']) {
    echo "✅ التسجيل نجح!\n";
    $userId = $registerResponseData['data']['user']['user_id'];
    $userRole = $registerResponseData['data']['role'];
    echo "User ID: {$userId}, Role: {$userRole}\n\n";
    
    // اختبار 2: تسجيل الدخول
    echo "2. اختبار تسجيل الدخول:\n";
    $loginData = json_encode([
        'email' => $uniqueEmail,
        'password' => 'password123'
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

    echo "HTTP Code: {$loginHttpCode}\n";
    $loginResponseData = json_decode($loginResponse, true);
    echo "Response: " . json_encode($loginResponseData, JSON_UNESCAPED_UNICODE) . "\n";

    if ($loginHttpCode === 200 && $loginResponseData['success']) {
        echo "✅ تسجيل الدخول نجح!\n";
        $token = $loginResponseData['data']['token'];
        echo "Token: " . substr($token, 0, 20) . "...\n";
        echo "Role: " . $loginResponseData['data']['role'] . "\n";
        
        // اختبار 3: التحقق من المستخدم المعتمد
        echo "\n3. اختبار التحقق من المستخدم المعتمد:\n";
        
        $ch = curl_init('http://127.0.0.1:8000/api/user');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $userResponse = curl_exec($ch);
        $userHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo "HTTP Code: {$userHttpCode}\n";
        echo "Response: " . json_encode(json_decode($userResponse, true), JSON_UNESCAPED_UNICODE) . "\n";

        if ($userHttpCode === 200) {
            echo "✅ التحقق من المستخدم المعتمد نجح!\n\n";
            
            echo "=== ملخص النتائج ===\n";
            echo "✅ التسجيل: نجح\n";
            echo "✅ تسجيل الدخول: نجح\n"; 
            echo "✅ التوكن: صالح\n";
            echo "✅ Role: {$userRole}\n";
            echo "✅ الربط بين الفرونت والباك إند: يعمل بشكل صحيح!\n";
            
            // التوجيه المناسب
            echo "\nالتوجيه المناسب للمستخدم:\n";
            switch($userRole) {
                case 'admin':
                    echo "👤 Admin → /admin/overview\n";
                    break;
                case 'parent':
                    echo "👨‍👩‍👧‍👦 Parent → /dashboard/parent\n";
                    break;
                case 'supervisor':
                    echo "👩‍💼 Supervisor → /dashboard/supervisor\n";
                    break;
                case 'school_manager':
                    echo "🏫 School Manager → /dashboard/school\n";
                    break;
                default:
                    echo "🔍 Default → /dashboard\n";
            }
            
        } else {
            echo "❌ التحقق من المستخدم المعتمد فشل!\n";
        }
    } else {
        echo "❌ تسجيل الدخول فشل!\n";
    }
} else {
    echo "❌ التسجيل فشل!\n";
}

echo "\n=== انتهى الاختبار ===\n";
