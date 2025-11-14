<?php

echo "=== Simple Schools Test ===\n";

// Test creating a new school with minimal data
$schoolData = json_encode([
    'name' => 'Test School',
    'address' => 'Test Address',
    'type' => 'primary'
]);

echo "School data: " . $schoolData . "\n";

$ch = curl_init('http://127.0.0.1:8000/api/schools');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $schoolData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer 231|XPzxEkWPFynKO5UADWoL2YCdOTLs90nZSuOZb7UKe317603c',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $status . "\n";
echo "Response: " . $response . "\n";