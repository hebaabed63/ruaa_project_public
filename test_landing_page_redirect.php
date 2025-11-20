<?php
// Test script to verify the landing page redirect after email verification

echo "=== Landing Page Redirect Test ===\n\n";

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
} else {
    echo "❌ Email verification page is not accessible. HTTP code: " . $http_code . "\n";
}

// Test 2: Check if the email verification page contains the correct redirect message
echo "\n2. Testing email verification success message...\n";

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
    echo "✅ Email verification page with success parameter is accessible\n";
    
    // Check if the page contains the correct redirect message
    if (strpos($body, 'الصفحة الرئيسية') !== false) {
        echo "✅ Page contains the correct redirect message to homepage\n";
    } else {
        echo "⚠️ Page might not contain the correct redirect message\n";
    }
} else {
    echo "❌ Email verification page with success parameter is not accessible. HTTP code: " . $http_code . "\n";
}

// Test 3: Check if the dashboard page redirects to landing page
echo "\n3. Testing dashboard component redirect...\n";

// Read the dashboard component file
$dashboardPath = 'c:\laragon\www\ruaa_project\frontend\my-project-main\src\pages\Dashboard.jsx';
if (file_exists($dashboardPath)) {
    $dashboardContent = file_get_contents($dashboardPath);
    
    // Check if the dashboard redirects to the landing page
    if (strpos($dashboardContent, "navigate('/', { replace: true })") !== false) {
        echo "✅ Dashboard component redirects to landing page\n";
    } else {
        echo "❌ Dashboard component does not redirect to landing page\n";
    }
    
    // Check if the dashboard has the correct loading message
    if (strpos($dashboardContent, 'الصفحة الرئيسية') !== false) {
        echo "✅ Dashboard component contains correct loading message\n";
    } else {
        echo "❌ Dashboard component does not contain correct loading message\n";
    }
} else {
    echo "❌ Dashboard component file not found\n";
}

// Test 4: Check if the email verification page redirects to landing page
echo "\n4. Testing email verification page redirect...\n";

// Read the email verification component file
$emailVerificationPath = 'c:\laragon\www\ruaa_project\frontend\my-project-main\src\pages\EmailVerification.jsx';
if (file_exists($emailVerificationPath)) {
    $emailVerificationContent = file_get_contents($emailVerificationPath);
    
    // Check if the email verification page redirects to the landing page
    if (strpos($emailVerificationContent, "navigate(\"/\")") !== false) {
        echo "✅ Email verification page redirects to landing page\n";
    } else {
        echo "❌ Email verification page does not redirect to landing page\n";
    }
    
    // Check if the email verification page has the correct message
    if (strpos($emailVerificationContent, 'الصفحة الرئيسية') !== false) {
        echo "✅ Email verification page contains correct redirect message\n";
    } else {
        echo "❌ Email verification page does not contain correct redirect message\n";
    }
} else {
    echo "❌ Email verification component file not found\n";
}

echo "\n=== Landing Page Redirect Test Completed ===\n";