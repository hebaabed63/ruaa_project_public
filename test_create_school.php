<?php
// Test script to verify school creation functionality

echo "Testing school creation...\n";

// First, let's login to get an authentication token
$loginData = [
    'email' => 'admin@example.com',
    'password' => 'password'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/ruaa_project/public/api/auth/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login HTTP Code: " . $loginHttpCode . "\n";

if ($loginHttpCode == 200) {
    $loginData = json_decode($loginResponse, true);
    $token = $loginData['data']['token'] ?? null;
    
    if ($token) {
        echo "Authentication successful. Token received.\n";
        
        // Now test creating a new school
        $schoolData = [
            'name' => 'مدرسة الاختبار',
            'address' => 'عنوان الاختبار',
            'type' => 'primary'  // Sending English value as expected by the backend
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://localhost/ruaa_project/public/api/schools");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($schoolData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
            'Authorization: Bearer ' . $token
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        echo "Create School HTTP Code: " . $httpCode . "\n";
        echo "Response: " . $response . "\n";

        curl_close($ch);
    } else {
        echo "Failed to get authentication token.\n";
    }
} else {
    echo "Login failed.\n";
    echo "Response: " . $loginResponse . "\n";
}