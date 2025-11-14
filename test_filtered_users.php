<?php

$token = '230|GhlNklqnnYc0t4XsusZdXjP1wsOauJszfWI3BINE7de73983';

// Test supervisors filter
$ch = curl_init('http://127.0.0.1:8000/api/admin/users?role=1');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Supervisors Filter Status: " . $status . "\n";
$result = json_decode($response, true);
if ($result && isset($result['data'])) {
    echo "Supervisors Count: " . count($result['data']) . "\n";
    foreach ($result['data'] as $user) {
        echo "- " . $user['name'] . " (" . $user['email'] . ")\n";
    }
}
echo "\n";

// Test admins filter
$ch = curl_init('http://127.0.0.1:8000/api/admin/users?role=0');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Admins Filter Status: " . $status . "\n";
$result = json_decode($response, true);
if ($result && isset($result['data'])) {
    echo "Admins Count: " . count($result['data']) . "\n";
    foreach ($result['data'] as $user) {
        echo "- " . $user['name'] . " (" . $user['email'] . ")\n";
    }
}