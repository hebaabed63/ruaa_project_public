<?php

$data = json_encode([
    'name' => 'Test User Final 2',
    'email' => 'testfinal2@example.com',  
    'password' => 'password123',
    'confirmPassword' => 'password123'
]);

$ch = curl_init('http://127.0.0.1:8000/api/auth/register');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo 'HTTP Code: ' . $http_code . PHP_EOL;
echo 'Response: ' . $response . PHP_EOL;
