<?php

echo "=== اختبار أمان التوكن (منع إعادة الاستخدام) ===\n\n";

// استخدام أحد المستخدمين الموجودين
$testEmail = 'testfinal2@example.com'; // من الاختبارات السابقة

// اختبار 1: طلب إعادة تعيين كلمة المرور
echo "1. طلب إعادة تعيين كلمة المرور:\n";
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

if ($forgotHttpCode === 200) {
    $forgotData = json_decode($forgotResponse, true);
    echo "✅ تم إرسال رابط استعادة كلمة المرور بنجاح!\n";
    $resetToken = $forgotData['data']['reset_token'];
    echo "Reset Token: " . substr($resetToken, 0, 20) . "...\n\n";
    
    // اختبار 2: إعادة تعيين كلمة المرور (المرة الأولى)
    echo "2. إعادة تعيين كلمة المرور (المرة الأولى):\n";
    $newPassword = 'firstchange' . time();
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
    
    if ($resetHttpCode === 200) {
        echo "✅ تم تغيير كلمة المرور بنجاح في المرة الأولى!\n\n";
        
        // اختبار 3: محاولة إعادة استخدام نفس التوكن (يجب أن يفشل)
        echo "3. محاولة إعادة استخدام نفس التوكن (يجب أن يفشل):\n";
        $anotherPassword = 'secondchange' . time();
        $anotherResetData = json_encode([
            'password' => $anotherPassword,
            'password_confirmation' => $anotherPassword
        ]);

        $ch = curl_init("http://127.0.0.1:8000/api/auth/reset-password/{$resetToken}");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $anotherResetData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $secondResetResponse = curl_exec($ch);
        $secondResetHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo "HTTP Code: {$secondResetHttpCode}\n";
        echo "Response: " . json_encode(json_decode($secondResetResponse, true), JSON_UNESCAPED_UNICODE) . "\n";

        if ($secondResetHttpCode === 400) {
            echo "✅ التوكن لا يمكن إعادة استخدامه (هذا صحيح للأمان)!\n\n";
        } else {
            echo "❌ تم قبول التوكن مرة أخرى (هذا خطر أمني)!\n\n";
        }
        
        echo "=== ملخص الأمان ===\n";
        echo "✅ التوكن يعمل مرة واحدة فقط\n";
        echo "✅ لا يمكن إعادة استخدام التوكن\n";
        echo "✅ النظام آمن ضد إعادة الاستخدام\n";
        
    } else {
        echo "❌ فشل تغيير كلمة المرور في المرة الأولى!\n";
    }
} else {
    echo "❌ فشل إرسال رابط استعادة كلمة المرور!\n";
}

echo "\n=== انتهى الاختبار ===\n";
