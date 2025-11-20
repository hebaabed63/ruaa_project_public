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
    
    // Test the login endpoint
    echo "Testing login endpoint...\n";
    $response = $client->post('/api/auth/login', [
        'json' => [
            'email' => 'admin@test.com',
            'password' => 'Admin123$'
        ]
    ]);
    
    echo "Login response: " . $response->getBody() . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}