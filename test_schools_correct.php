<?php

$token = '231|XPzxEkWPFynKO5UADWoL2YCdOTLs90nZSuOZb7UKe317603c';

// Test schools endpoint (without admin prefix)
$ch = curl_init('http://127.0.0.1:8000/api/schools');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Schools Status: " . $status . "\n";
echo "Schools Response: " . $response . "\n";