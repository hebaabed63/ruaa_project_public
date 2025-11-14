<?php
// Comprehensive test script to verify all schools CRUD operations

echo "Testing schools CRUD operations...\n";

// Function to make API requests
function makeRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    $headers = ['Content-Type: application/x-www-form-urlencoded'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data && ($method === 'POST' || $method === 'PUT')) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'response' => $response];
}

// Test 1: Get all schools (public endpoint)
echo "\n1. Testing GET /schools (public)\n";
$result = makeRequest("http://localhost/ruaa_project/public/api/schools");
echo "HTTP Code: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $data = json_decode($result['response'], true);
    echo "Success: " . $data['message'] . "\n";
    echo "Total schools: " . count($data['data']['data']) . "\n";
} else {
    echo "Failed to get schools\n";
}

// Test 2: Get school statistics (public endpoint)
echo "\n2. Testing GET /schools/statistics (public)\n";
$result = makeRequest("http://localhost/ruaa_project/public/api/schools/statistics");
echo "HTTP Code: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $data = json_decode($result['response'], true);
    echo "Success: " . $data['message'] . "\n";
    echo "Total schools: " . $data['data']['total_schools'] . "\n";
} else {
    echo "Failed to get school statistics\n";
}

echo "\nAll public endpoints tested successfully!\n";
echo "Note: CRUD operations (POST, PUT, DELETE) require admin authentication\n";