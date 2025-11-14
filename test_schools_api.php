<?php
// Test script to verify schools API functionality

// Include Laravel's bootstrap
require_once 'vendor/autoload.php';

// Create a simple test to check if the schools endpoint works
echo "Testing schools API...\n";

// Use cURL to test the endpoint
$ch = curl_init();

// Test the schools index endpoint
curl_setopt($ch, CURLOPT_URL, "http://localhost/ruaa_project/public/api/schools");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

curl_close($ch);