<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;

// Create a Guzzle HTTP client
$client = new Client([
    'base_uri' => 'http://127.0.0.1:8000',
    'timeout'  => 10,
]);

try {
    echo "Testing complete registration and email verification flow...\n";
    
    // Register a new user
    echo "Registering a new user...\n";
    $response = $client->post('/api/auth/register', [
        'json' => [
            'fullName' => 'Complete Flow Test User',
            'email' => 'completeflow@example.com',
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
        echo "The email should contain a link like: http://127.0.0.1:8000/verify-email/{token}\n";
        echo "Click that link to complete the verification process.\n";
    } else {
        echo "Registration failed.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}