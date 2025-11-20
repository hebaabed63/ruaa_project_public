<?php

// Test the check-email page
echo "Testing the check-email page...\n";

// Use cURL to test the page
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/check-email?email=test@example.com");
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
echo "Response Headers:\n" . $header . "\n";

if ($http_code == 200) {
    echo "SUCCESS: The check-email page is working correctly!\n";
    // Check if the page contains expected content
    if (strpos($body, 'تحقق من بريدك الإلكتروني') !== false) {
        echo "SUCCESS: Page contains the expected Arabic text!\n";
    } else {
        echo "WARNING: Page might be missing expected content.\n";
    }
} else {
    echo "ERROR: The check-email page is not working. HTTP code: " . $http_code . "\n";
}