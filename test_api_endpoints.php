<?php

// Test the supervisor principal links API endpoints

// Test data
$apiUrl = 'http://127.0.0.1:8000/api';
$supervisorEmail = 'supervisor@ruaa.com';
$supervisorPassword = 'supervisor123';

echo "Testing Supervisor Principal Links API Endpoints\n";
echo "===============================================\n\n";

// 1. Login as supervisor to get auth token
echo "1. Logging in as supervisor...\n";

$loginData = [
    'email' => $supervisorEmail,
    'password' => $supervisorPassword
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl . '/auth/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $loginResponse = json_decode($response, true);
    $authToken = $loginResponse['data']['token'];
    echo "✅ Login successful. Auth token: " . substr($authToken, 0, 20) . "...\n\n";
    
    // 2. Create a principal invitation link
    echo "2. Creating principal invitation link...\n";
    
    $linkData = [
        'expires_at' => date('Y-m-d H:i:s', strtotime('+2 weeks')),
        'max_uses' => 5
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl . '/supervisor/principal-links');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($linkData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $authToken
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 201) {
        $createResponse = json_decode($response, true);
        echo "✅ Principal link created successfully.\n";
        echo "Link token: " . $createResponse['data']['token'] . "\n";
        echo "Link ID: " . $createResponse['data']['link_id'] . "\n\n";
        
        // 3. Get all principal links for supervisor
        echo "3. Retrieving principal links...\n";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl . '/supervisor/principal-links');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $authToken
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $linksResponse = json_decode($response, true);
            echo "✅ Retrieved principal links successfully.\n";
            echo "Total links: " . count($linksResponse['data']) . "\n";
            
            if (count($linksResponse['data']) > 0) {
                echo "First link token: " . $linksResponse['data'][0]['token'] . "\n";
            }
        } else {
            echo "❌ Failed to retrieve principal links. HTTP code: $httpCode\n";
            echo "Response: $response\n";
        }
    } else {
        echo "❌ Failed to create principal link. HTTP code: $httpCode\n";
        echo "Response: $response\n";
    }
} else {
    echo "❌ Login failed. HTTP code: $httpCode\n";
    echo "Response: $response\n";
}

echo "\nTest completed.\n";