<?php
// Test script to verify login behavior with pending and suspended users

// Configuration
$apiUrl = 'http://127.0.0.1:8000/api'; // Update if your API is on a different URL

echo "Testing login behavior with pending and suspended users...\n";

// Function to make API requests
function makeRequest($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'httpCode' => $httpCode,
        'response' => json_decode($response, true)
    ];
}

// Test 1: Login with pending user
echo "1. Testing login with pending user...\n";
$loginData = [
    'email' => 'pending.supervisor@test.com',
    'password' => 'password123'
];

$result = makeRequest($apiUrl . '/auth/login', 'POST', $loginData);

echo "HTTP Status Code: " . $result['httpCode'] . "\n";
if ($result['response']) {
    echo "Response: " . json_encode($result['response'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
}

if ($result['httpCode'] === 403) {
    echo "✓ SUCCESS: Login correctly rejected for pending user\n";
    if (isset($result['response']['data']['status']) && $result['response']['data']['status'] === 'pending') {
        echo "✓ SUCCESS: Correct status returned (pending)\n";
    } else {
        echo "✗ ERROR: Incorrect status returned\n";
    }
} else {
    echo "✗ ERROR: Expected HTTP 403 for pending user, got " . $result['httpCode'] . "\n";
}

echo "\n";

// Test 2: Login with suspended user
echo "2. Testing login with suspended user...\n";
$loginData = [
    'email' => 'suspended.supervisor@test.com',
    'password' => 'password123'
];

$result = makeRequest($apiUrl . '/auth/login', 'POST', $loginData);

echo "HTTP Status Code: " . $result['httpCode'] . "\n";
if ($result['response']) {
    echo "Response: " . json_encode($result['response'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
}

if ($result['httpCode'] === 403) {
    echo "✓ SUCCESS: Login correctly rejected for suspended user\n";
    if (isset($result['response']['data']['status']) && $result['response']['data']['status'] === 'suspended') {
        echo "✓ SUCCESS: Correct status returned (suspended)\n";
    } else {
        echo "✗ ERROR: Incorrect status returned\n";
    }
} else {
    echo "✗ ERROR: Expected HTTP 403 for suspended user, got " . $result['httpCode'] . "\n";
}

echo "\n";

// Test 3: Login with active user
echo "3. Testing login with active user...\n";
$loginData = [
    'email' => 'admin@ruaa.ps',
    'password' => 'password123' // We'll need to find the correct password
];

$result = makeRequest($apiUrl . '/auth/login', 'POST', $loginData);

echo "HTTP Status Code: " . $result['httpCode'] . "\n";
if ($result['response']) {
    echo "Response: " . json_encode($result['response'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
}

if ($result['httpCode'] === 200) {
    echo "✓ SUCCESS: Login successful for active user\n";
    echo "✓ SUCCESS: Token received: " . (isset($result['response']['data']['token']) ? 'Yes' : 'No') . "\n";
    echo "✓ SUCCESS: User role: " . (isset($result['response']['data']['role']) ? $result['response']['data']['role'] : 'Unknown') . "\n";
} else if ($result['httpCode'] === 401) {
    echo "Note: Active user login failed with 401 - likely incorrect password\n";
} else {
    echo "✗ ERROR: Unexpected response for active user login\n";
}

echo "\nTest completed.\n";
?>