<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;

// Create a Guzzle HTTP client
$client = new Client([
    'base_uri' => 'http://127.0.0.1:8000',
    'timeout'  => 10,
]);

try {
    // Test the health endpoint first
    echo "Testing health endpoint...\n";
    $response = $client->get('/api/health');
    echo "Health check response: " . $response->getBody() . "\n\n";
    
    // Register a new user to test email verification
    echo "Registering a new user...\n";
    $response = $client->post('/api/auth/register', [
        'json' => [
            'fullName' => 'Test User',
            'email' => 'testuser2@example.com',
            'password' => 'Password123$',
            'confirmPassword' => 'Password123$'
        ]
    ]);
    
    $responseData = json_decode($response->getBody(), true);
    echo "Registration response: " . $response->getBody() . "\n";
    
    if ($responseData['success']) {
        echo "User registered successfully! Please check the email for verification instructions.\n";
        echo "The verification email should now contain the correct URL.\n";
    } else {
        echo "Registration failed.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}