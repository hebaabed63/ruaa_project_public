<?php
// Comprehensive test script to verify all schools API functionality

echo "Testing schools API...\n";

// Test 1: Get all schools
echo "\n1. Testing GET /schools\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/ruaa_project/public/api/schools");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
if ($httpCode == 200) {
    $data = json_decode($response, true);
    echo "Success: " . $data['message'] . "\n";
    echo "Total schools: " . count($data['data']['data']) . "\n";
} else {
    echo "Failed to get schools\n";
}

// Test 2: Get school statistics
echo "\n2. Testing GET /schools/statistics\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/ruaa_project/public/api/schools/statistics");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
if ($httpCode == 200) {
    $data = json_decode($response, true);
    echo "Success: " . $data['message'] . "\n";
    echo "Total schools: " . $data['data']['total_schools'] . "\n";
    echo "Schools by type: \n";
    foreach ($data['data']['schools_by_type'] as $type) {
        echo "  " . $type['type'] . ": " . $type['count'] . "\n";
    }
} else {
    echo "Failed to get school statistics\n";
}

echo "\nAll tests completed.\n";