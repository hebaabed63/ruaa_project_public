<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;

// Create a Guzzle HTTP client
$client = new Client([
    'base_uri' => 'http://127.0.0.1:8000',
    'timeout'  => 10,
]);

try {
    echo "Testing user registration and email verification...\n";
    
    // Register a new user to test email verification
    echo "Registering a new user...\n";
    $response = $client->post('/api/auth/register', [
        'json' => [
            'fullName' => 'Email Test User',
            'email' => 'emailtest@example.com',
            'password' => 'Password123$',
            'confirmPassword' => 'Password123$'
        ]
    ]);
    
    $responseData = json_decode($response->getBody(), true);
    echo "Registration response status: " . $response->getStatusCode() . "\n";
    echo "Registration success: " . ($responseData['success'] ? 'true' : 'false') . "\n";
    echo "Registration message: " . $responseData['message'] . "\n";
    
    if ($responseData['success']) {
        echo "User registered successfully!\n";
        echo "Please check Mailpit at http://localhost:8025 to see the verification email.\n";
    } else {
        echo "Registration failed.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}