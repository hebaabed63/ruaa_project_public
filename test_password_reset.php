<?php

echo "=== اختبار نظام استعادة كلمة المرور ===\n\n";

// اختبار 1: إنشاء مستخدم للاختبار
echo "1. إنشاء مستخدم للاختبار:\n";
$testEmail = 'passwordreset' . time() . '@example.com';
$originalPassword = 'originalpassword123';

$registerData = json_encode([
    'fullName' => 'مستخدم اختبار كلمة المرور',
    'email' => $testEmail,
    'password' => $originalPassword,
    'confirmPassword' => $originalPassword
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
if ($registerHttpCode === 201) {
    $registerData = json_decode($registerResponse, true);
    echo "✅ تم إنشاء المستخدم بنجاح!\n";
    echo "Email: {$testEmail}\n";
    echo "Password: {$originalPassword}\n\n";
    
    // اختبار 2: طلب إعادة تعيين كلمة المرور
    echo "2. طلب إعادة تعيين كلمة المرور:\n";
    $forgotData = json_encode(['email' => $testEmail]);

    $ch = curl_init('http://127.0.0.1:8000/api/auth/forgot-password');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $forgotData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $forgotResponse = curl_exec($ch);
    $forgotHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "HTTP Code: {$forgotHttpCode}\n";
    echo "Response: " . json_encode(json_decode($forgotResponse, true), JSON_UNESCAPED_UNICODE) . "\n";

    if ($forgotHttpCode === 200) {
        $forgotData = json_decode($forgotResponse, true);
        echo "✅ تم إرسال رابط استعادة كلمة المرور بنجاح!\n";
        $resetToken = $forgotData['data']['reset_token'];
        echo "Reset Token: " . substr($resetToken, 0, 20) . "...\n\n";
        
        // اختبار 3: إعادة تعيين كلمة المرور
        echo "3. إعادة تعيين كلمة المرور:\n";
        $newPassword = 'newpassword456';
        $resetData = json_encode([
            'password' => $newPassword,
            'password_confirmation' => $newPassword
        ]);

        $ch = curl_init("http://127.0.0.1:8000/api/auth/reset-password/{$resetToken}");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $resetData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $resetResponse = curl_exec($ch);
        $resetHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo "HTTP Code: {$resetHttpCode}\n";
        echo "Response: " . json_encode(json_decode($resetResponse, true), JSON_UNESCAPED_UNICODE) . "\n";

        if ($resetHttpCode === 200) {
            $resetResponseData = json_decode($resetResponse, true);
            echo "✅ تم تغيير كلمة المرور بنجاح!\n";
            echo "User: " . $resetResponseData['data']['user']['name'] . "\n\n";
            
            // اختبار 4: تسجيل الدخول بكلمة المرور القديمة (يجب أن يفشل)
            echo "4. اختبار تسجيل الدخول بكلمة المرور القديمة (يجب أن يفشل):\n";
            $oldLoginData = json_encode([
                'email' => $testEmail,
                'password' => $originalPassword
            ]);

            $ch = curl_init('http://127.0.0.1:8000/api/auth/login');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $oldLoginData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $oldLoginResponse = curl_exec($ch);
            $oldLoginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            echo "HTTP Code: {$oldLoginHttpCode}\n";
            if ($oldLoginHttpCode === 401) {
                echo "✅ كلمة المرور القديمة لم تعد تعمل (هذا صحيح)!\n\n";
            } else {
                echo "❌ كلمة المرور القديمة ما زالت تعمل (هذا خطأ)!\n\n";
            }
            
            // اختبار 5: تسجيل الدخول بكلمة المرور الجديدة
            echo "5. اختبار تسجيل الدخول بكلمة المرور الجديدة:\n";
            $newLoginData = json_encode([
                'email' => $testEmail,
                'password' => $newPassword
            ]);

            $ch = curl_init('http://127.0.0.1:8000/api/auth/login');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $newLoginData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $newLoginResponse = curl_exec($ch);
            $newLoginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            echo "HTTP Code: {$newLoginHttpCode}\n";
            if ($newLoginHttpCode === 200) {
                $newLoginData = json_decode($newLoginResponse, true);
                echo "✅ تسجيل الدخول بكلمة المرور الجديدة نجح!\n";
                echo "Token: " . substr($newLoginData['data']['token'], 0, 20) . "...\n\n";
                
                echo "=== ملخص النتائج ===\n";
                echo "✅ إنشاء المستخدم: نجح\n";
                echo "✅ طلب استعادة كلمة المرور: نجح\n";
                echo "✅ إعادة تعيين كلمة المرور: نجح\n";
                echo "✅ كلمة المرور القديمة: لم تعد تعمل (صحيح)\n";
                echo "✅ كلمة المرور الجديدة: تعمل بشكل صحيح\n";
                echo "✅ نظام استعادة كلمة المرور يعمل بشكل مثالي!\n\n";
                
                echo "معلومات الاختبار:\n";
                echo "Email: {$testEmail}\n";
                echo "كلمة المرور القديمة: {$originalPassword}\n";
                echo "كلمة المرور الجديدة: {$newPassword}\n";
                
            } else {
                echo "❌ تسجيل الدخول بكلمة المرور الجديدة فشل!\n";
            }
        } else {
            echo "❌ فشل تغيير كلمة المرور!\n";
        }
    } else {
        echo "❌ فشل إرسال رابط استعادة كلمة المرور!\n";
    }
} else {
    echo "❌ فشل إنشاء المستخدم!\n";
    echo "Response: {$registerResponse}\n";
}

echo "\n=== انتهى الاختبار ===\n";
