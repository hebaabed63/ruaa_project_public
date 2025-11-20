<?php

// Test the login API endpoint directly
$url = 'http://127.0.0.1:8000/api/auth/login';

$data = [
    'email' => 'test@example.com',
    'password' => 'password'
];

$jsonData = json_encode($data);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Only for development

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

// Try to decode the JSON response
$responseData = json_decode($response, true);
if ($responseData) {
    echo "Parsed Response:\n";
    print_r($responseData);
} else {
    echo "Could not parse JSON response\n";
}

?>