<?php
// Test script to verify the branding update from "نظام رعاية" to "منصة رؤى"

echo "=== Branding Update Verification Test ===\n\n";

// Test 1: Check if the email verification page contains the new branding
echo "1. Testing email verification page branding...\n";

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
    
    // Check if the page contains the new branding
    if (strpos($body, 'منصة رؤى') !== false) {
        echo "✅ Page contains the new branding 'منصة رؤى'\n";
    } else {
        echo "⚠️ Page might not contain the new branding\n";
    }
    
    // Check if the old branding is no longer present
    if (strpos($body, 'نظام رعاية') === false) {
        echo "✅ Page no longer contains the old branding 'نظام رعاية'\n";
    } else {
        echo "❌ Page still contains the old branding 'نظام رعاية'\n";
    }
} else {
    echo "❌ Email verification page is not accessible. HTTP code: " . $http_code . "\n";
}

// Test 2: Check email template branding
echo "\n2. Testing email template branding...\n";

// Read the email template file
$emailTemplatePath = 'c:\laragon\www\ruaa_project\resources\views\emails\verification.blade.php';
if (file_exists($emailTemplatePath)) {
    $emailTemplateContent = file_get_contents($emailTemplatePath);
    
    if (strpos($emailTemplateContent, 'منصة رؤى') !== false) {
        echo "✅ Email template contains the new branding 'منصة رؤى'\n";
    } else {
        echo "❌ Email template does not contain the new branding 'منصة رؤى'\n";
    }
    
    if (strpos($emailTemplateContent, 'نظام رعاية') === false) {
        echo "✅ Email template no longer contains the old branding 'نظام رعاية'\n";
    } else {
        echo "❌ Email template still contains the old branding 'نظام رعاية'\n";
    }
} else {
    echo "❌ Email template file not found\n";
}

// Test 3: Check email subject branding
echo "\n3. Testing email subject branding...\n";

// Read the VerificationEmail class file
$verificationEmailPath = 'c:\laragon\www\ruaa_project\app\Mail\VerificationEmail.php';
if (file_exists($verificationEmailPath)) {
    $verificationEmailContent = file_get_contents($verificationEmailPath);
    
    if (strpos($verificationEmailContent, 'منصة رؤى') !== false) {
        echo "✅ VerificationEmail class contains the new branding 'منصة رؤى'\n";
    } else {
        echo "❌ VerificationEmail class does not contain the new branding 'منصة رؤى'\n";
    }
    
    if (strpos($verificationEmailContent, 'نظام رعاية') === false) {
        echo "✅ VerificationEmail class no longer contains the old branding 'نظام رعاية'\n";
    } else {
        echo "❌ VerificationEmail class still contains the old branding 'نظام رعاية'\n";
    }
} else {
    echo "❌ VerificationEmail class file not found\n";
}

echo "\n=== Branding Update Test Completed ===\n";