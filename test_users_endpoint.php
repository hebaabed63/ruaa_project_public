<?php

// Simple test using cURL to check the users endpoint
function testUsersEndpoint() {
    // First, login to get a token
    $loginData = [
        'email' => 'admin@ruaa.com',
        'password' => 'admin123'
    ];
    
    $loginResponse = makeRequest('POST', 'http://127.0.0.1:8000/api/auth/login', $loginData);
    
    echo "Login Status: " . $loginResponse['status'] . "\n";
    echo "Login Response: " . $loginResponse['body'] . "\n\n";
    
    if ($loginResponse['status'] == 200) {
        $loginResult = json_decode($loginResponse['body'], true);
        if (isset($loginResult['data']['token'])) {
            $token = $loginResult['data']['token'];
            
            // Now test the users endpoint
            $usersResponse = makeRequest('GET', 'http://127.0.0.1:8000/api/admin/users', [], [
                'Authorization: Bearer ' . $token
            ]);
            
            echo "Users Status: " . $usersResponse['status'] . "\n";
            echo "Users Response: " . $usersResponse['body'] . "\n";
        } else {
            echo "Failed to get token from login response\n";
        }
    } else {
        echo "Login failed\n";
    }
}

function makeRequest($method, $url, $data = [], $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if (!empty($data)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $headers[] = 'Content-Type: application/json';
    }
    
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    curl_close($ch);
    
    return [
        'status' => $status,
        'body' => $response
    ];
}

// Run the test
testUsersEndpoint();