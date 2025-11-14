<?php

require_once 'vendor/autoload.php';

try {
    // First, let's login to get a token
    $loginResponse = \Illuminate\Support\Facades\Http::post('http://127.0.0.1:8000/api/auth/login', [
        'email' => 'admin@ruaa.com',
        'password' => 'admin123'
    ]);

    echo "Login Status: " . $loginResponse->status() . "\n";
    echo "Login Response: " . $loginResponse->body() . "\n\n";

    if ($loginResponse->successful()) {
        $loginData = $loginResponse->json();
        if (isset($loginData['data']['token'])) {
            $token = $loginData['data']['token'];
            
            // Now test the dashboard statistics endpoint
            $dashboardResponse = \Illuminate\Support\Facades\Http::withToken($token)
                ->get('http://127.0.0.1:8000/api/admin/dashboard/statistics');

            echo "Dashboard Stats Status: " . $dashboardResponse->status() . "\n";
            echo "Dashboard Stats Response: " . $dashboardResponse->body() . "\n";
        } else {
            echo "Failed to get token from login response\n";
        }
    } else {
        echo "Login failed\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}