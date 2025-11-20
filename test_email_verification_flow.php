<?php
// Test script to verify the email verification flow

echo "=== Email Verification Flow Test ===\n\n";

// Test 1: Check if the email verification page exists
echo "1. Testing email verification page...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/email-verification");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "HTTP Status Code: " . $http_code . "\n";
if ($http_code == 200) {
    echo "✅ Email verification page is accessible\n";
    
    // Check if the page contains expected content
    if (strpos($body, 'جاري التحقق من البريد الإلكتروني') !== false) {
        echo "✅ Page contains the expected Arabic text\n";
    } else {
        echo "⚠️ Page might be missing expected content\n";
    }
} else {
    echo "❌ Email verification page is not accessible. HTTP code: " . $http_code . "\n";
}

// Test 2: Test with success parameter
echo "\n2. Testing with success parameter...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/email-verification?email_verification=success&message=" . urlencode('تم التحقق بنجاح'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "HTTP Status Code: " . $http_code . "\n";
if ($http_code == 200) {
    echo "✅ Email verification page with parameters is working correctly\n";
} else {
    echo "❌ Email verification page with parameters is not working. HTTP code: " . $http_code . "\n";
}

// Test 3: Test with error parameter
echo "\n3. Testing with error parameter...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/email-verification?email_verification=failed&message=" . urlencode('رابط التحقق غير صحيح أو منتهي الصلاحية'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "HTTP Status Code: " . $http_code . "\n";
if ($http_code == 200) {
    echo "✅ Email verification page with error parameters is working correctly\n";
} else {
    echo "❌ Email verification page with error parameters is not working. HTTP code: " . $http_code . "\n";
}

echo "\n=== Test Completed ===\n";