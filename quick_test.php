<?php

echo "=== اختبار سريع للـ API ===\n";

// اختبار forgot password
$data = json_encode(['email' => 'testfinal2@example.com']);

$ch = curl_init('http://127.0.0.1:8000/api/auth/forgot-password');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
}
echo "Response: $response\n";

if ($httpCode !== 200 && $httpCode !== 201) {
    echo "❌ هناك مشكلة في API\n";
    
    // تحقق من logs Laravel
    echo "\n=== فحص Laravel logs ===\n";
    $logFile = 'storage/logs/laravel.log';
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $recentLogs = substr($logs, -2000); // آخر 2000 حرف
        echo $recentLogs;
    } else {
        echo "ملف الlog غير موجود\n";
    }
} else {
    echo "✅ API يعمل بشكل صحيح\n";
}
