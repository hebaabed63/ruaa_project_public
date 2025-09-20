<?php

require_once 'vendor/autoload.php';

try {
    $response = \Illuminate\Support\Facades\Http::post('http://127.0.0.1:8000/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'confirmPassword' => 'password123'
    ]);

    echo "Status: " . $response->status() . "\n";
    echo "Response: " . $response->body() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
